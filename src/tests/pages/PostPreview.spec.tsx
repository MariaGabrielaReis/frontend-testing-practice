import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("../../services/prismic");
jest.mock("next-auth/client");
jest.mock("next/router");

const post = {
  slug: "fake-post-slug",
  title: "fake-post-title",
  content: "<p>fake-post-excerpt</p>",
  updatedAt: "21 de julho de 2021",
};

describe("PostPreview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<Post post={post} />);

    expect(screen.getByText("fake-post-title")).toBeInTheDocument();
    expect(screen.getByText("fake-post-excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: "fake-active-subscription",
      },
      false,
    ] as any);

    const pushMock = jest.fn();
    const useRouterMocked = jest.mocked(useRouter);
    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/fake-post-slug");
  });

  it("loads initial data", async () => {
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

    const response = await getStaticProps({
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
