import { render, screen } from "@testing-library/react";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

jest.mock("../../services/prismic");

const posts = [
  {
    slug: "fake-post-slug",
    title: "fake-post-title",
    excerpt: "fake-post-excerpt",
    updatedAt: "21 de julho de 2021",
  },
];

describe("Posts page", () => {
  it("renders correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("fake-post-title")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "fake-post-slug",
            data: {
              title: [
                {
                  type: "heading",
                  text: "fake-post-title",
                },
              ],
              content: [
                {
                  type: "paragraph",
                  text: "fake-post-excerpt",
                },
              ],
            },
            last_publication_date: "07-21-2021",
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "fake-post-slug",
              title: "fake-post-title",
              excerpt: "fake-post-excerpt",
              updatedAt: "21 de julho de 2021",
            },
          ],
        },
      }),
    );
  });
});
