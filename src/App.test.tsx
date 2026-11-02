import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostComposerPage from "./pages/PostComposerPage";

let mockSubscription = { tier: "free", status: "active" };
const mockSchedule = jest.fn();
const mockPublish = jest.fn();
jest.mock("react-redux", () => ({
  useSelector: (select: any) =>
    select({
      auth: {
        user: { userId: "test-account" },
        subscription: mockSubscription,
      },
    }),
}));
jest.mock("./store/apiSlice", () => ({
  useGetSocialAccountsQuery: () => ({
    data: {
      accounts: [
        {
          accountId: "ig-test",
          platform: "instagram",
          accountName: "Test account",
        },
      ],
    },
    isLoading: false,
    isError: false,
  }),
  useGetUserVideosQuery: () => ({
    data: {
      videos: [
        {
          videoId: "11111111-1111-4111-8111-111111111111",
          title: "Existing video",
          status: "completed",
        },
      ],
    },
    isLoading: false,
    isError: false,
  }),
}));
jest.mock("./services/api", () => ({
  videosApi: {
    getVideo: async () => ({ data: { video: { title: "Existing video" } } }),
    updateSocialMetadata: async () => ({ data: {} }),
    batchSocialUpload: (...args: any[]) => mockPublish(...args),
  },
  scheduledPostsApi: {
    createScheduledPost: (...args: any[]) => mockSchedule(...args),
  },
}));
jest.mock("./components/PublishingPaywall", () => ({
  __esModule: true,
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? (
      <div role="dialog" aria-label="Choose a plan">
        <button onClick={onClose}>Keep exploring</button>
      </div>
    ) : null,
}));

beforeEach(() => {
  mockSubscription = { tier: "free", status: "active" };
  mockSchedule.mockReset();
  mockPublish.mockReset();
});
test("free accounts can open and prepare the composer; the paywall appears only on submit", async () => {
  const { container } = render(
    <MemoryRouter
      initialEntries={[
        "/posts/new?videoId=11111111-1111-4111-8111-111111111111",
      ]}
    >
      <PostComposerPage />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { name: "Prepare a post" }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  fireEvent.submit(container.querySelector("form")!);
  expect(
    await screen.findByRole("dialog", { name: "Choose a plan" }),
  ).toBeInTheDocument();
  expect(mockSchedule).not.toHaveBeenCalled();
  expect(mockPublish).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("Keep exploring"));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Prepare a post" }),
  ).toBeInTheDocument();
});
test("paid scheduling uses an existing video and exact selected account without generation", async () => {
  mockSubscription = { tier: "starter", status: "active" };
  mockSchedule.mockResolvedValue({
    data: { scheduledPost: { scheduleId: "schedule-test" } },
  });
  const { container } = render(
    <MemoryRouter
      initialEntries={[
        "/posts/new?videoId=11111111-1111-4111-8111-111111111111",
      ]}
    >
      <PostComposerPage />
    </MemoryRouter>,
  );
  await waitFor(() =>
    expect(screen.getByLabelText(/Title/)).toHaveValue("Existing video"),
  );
  fireEvent.click(screen.getByLabelText("Instagram · Test account"));
  fireEvent.change(screen.getByLabelText(/Date & time/), {
    target: { value: "2030-01-01T10:00" },
  });
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(mockSchedule).toHaveBeenCalledTimes(1));
  expect(mockSchedule.mock.calls[0][0]).toMatchObject({
    videoId: "11111111-1111-4111-8111-111111111111",
    platforms: [{ platform: "instagram", accountId: "ig-test" }],
    title: "Existing video",
  });
  expect(mockPublish).not.toHaveBeenCalled();
});
