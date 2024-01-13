import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { env } from "~/env";

import { Octokit } from "octokit";
import { graphql } from "@octokit/graphql";

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: "Bearer " + env.GITHUB_TOKEN,
  },
});

import { githubRepo, githubOwner, githubEmail, githubNoReplyEmail } from "~/data/typed/objects";

interface QuerySchema {
  repository: {
    defaultBranchRef: {
      target: {
        history: {
          edges: {
            node: {
              additions: number;
              deletions: number;
            };
          }[];
        };
      };
    };
  };
}

const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
});

export const githubRouter = createTRPCRouter({
  fetchRepoDate: publicProcedure.query(async () => {
    return await getLastCommitDate({ githubOwner, githubRepo });
  }),

  fetchCommitContributions: publicProcedure
    .input(z.object({ repo_url: z.string() }))
    .query(async ({ input }) => {
      const matchRepoData = input.repo_url.match(
        /https:\/\/github.com\/([^\/]+)\/(.*)/,
      );

      if (!matchRepoData) {
        throw new Error("Invalid repo url");
      }

      const owner = matchRepoData[1];
      const repo = matchRepoData[2];

      if (!owner || !repo) {
        throw new Error("Owner or repo not found");
      }

      const commitData = await octokit.rest.repos.listCommits({
        owner: owner,
        repo: repo,
        per_page: 1,
      });

      const linkHeader = commitData.headers.link;
      const match = linkHeader?.match(/<[^>]+>; rel="last"/);

      let commitCount = -1;
      try {
        if (match) {
          // Extract the total number of pages from the Link header
          const lastPageUrl = match[0].substring(1, match[0].indexOf(">"));
          const matchResult = lastPageUrl.match(/[?&]+page=(\d+)/);
          commitCount = parseInt(matchResult?.[1] ?? "-1", 10);
        } else {
          commitCount = commitData.data.length;
        }
      } catch (error: any) {
        console.error("Error fetching commit count:", error.message);
      }

      const lastCommitDate = await getLastCommitDate({
        githubOwner: owner,
        githubRepo: repo,
      });

      let additions = 0;
      let deletions = 0;
      let userCommits = 0;

      const response = await graphqlWithAuth<QuerySchema>(
        `
          query GetUserCommitHistory($owner: String!, $repo: String!, $email: [String!]) {
            repository(owner: $owner, name: $repo) {
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(author: {emails: $email}) {
                      edges {
                        node {
                          additions
                          deletions
                        }
                      }
                    }
                  }
                }
              }
            }
          }
    `,
        {
          owner: owner,
          repo: repo,
          email: [githubEmail, githubNoReplyEmail],
        },
      );

      userCommits =
        response.repository.defaultBranchRef.target.history.edges.length;
      response.repository.defaultBranchRef.target.history.edges.forEach(
        (edge) => {
          additions += edge.node.additions;
          deletions += edge.node.deletions;
        },
      );

      return {
        userCommits,
        commitCount,
        additions,
        deletions,
        lastCommitDate,
      };
    }),
});

const getLastCommitDate = async ({
  githubOwner,
  githubRepo,
}: {
  githubOwner: string;
  githubRepo: string;
}) => {
  const lastCommit = await octokit.rest.repos.listCommits({
    per_page: 1,
    owner: githubOwner,
    repo: githubRepo,
  });

  const lastCommitDate = lastCommit?.data[0]?.commit?.author?.date
    ? new Date(lastCommit?.data[0]?.commit?.author?.date)
    : undefined;

  return lastCommitDate;
};
