import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/client";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("../../services/prismic");
jest.mock("next-auth/client");

const post = {
  slug: "fake-post-slug",
  title: "fake-post-title",
  content: "<p>fake-post-excerpt</p>",
  updatedAt: "21 de julho de 2021",
};

describe("Post page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("fake-post-title")).toBeInTheDocument();
    expect(screen.getByText("fake-post-excerpt")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: {
        slug: "fake-post-slug",
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({ destination: "/" }),
      }),
    );
  });

  it("loads initial data", async () => {
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);

    const getPrismicClientMocked = jest.mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockReturnValueOnce({
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
      }),
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: "fake-post-slug",
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "fake-post-slug",
            title: "fake-post-title",
            content: "<p>fake-post-excerpt</p>",
            updatedAt: "21 de julho de 2021",
          },
        },
      }),
    );
  });
});
