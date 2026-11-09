# Instagram and TikTok carousels: upload, order and schedule your images

Prepare 2 to 10 images for Instagram, TikTok or a Facebook Page, then publish now or choose a future time.

![Gruvi unfolding a five-frame picture sequence from sunrise to night.](https://agentgruvi.com/marketing/blog/gruvi-carousel-editorial.webp)

Canonical: https://agentgruvi.com/blog/instagram-tiktok-carousel-posts
Published: 2026-11-03T03:22:42+00:00
Updated: 2026-11-03T04:52:48.380Z
Author: Gruvi

## What you need to know
- A carousel is an ordered image post, not a batch of separate video posts.
- Gruvi accepts 2 to 10 JPEG, PNG or WebP images, up to 5 MB each.
- Choose one Instagram, TikTok or Facebook Page destination per carousel operation.

## What is a carousel post?

A carousel combines several images into one post that a viewer can move through. It works well for a short visual sequence, a product walkthrough or a set of ideas that need more than one frame. It is a different workflow from bulk scheduling, where each video becomes a separate scheduled post.

Gruvi supports image carousels for Instagram and TikTok, and multi-photo posts for Facebook Pages. You bring the images, arrange their order and add the caption. The same preparation flow is available in the dashboard and through the API or MCP connector. Platform account eligibility and permissions still apply.

## Prepare a consistent image set

Choose 2 to 10 JPEG, PNG or WebP files, each no larger than 5 MB. Gruvi validates the uploaded image bytes and places each image on a 1080 by 1350 canvas. Images are fitted without cropping, so a different aspect ratio can leave padding around the original artwork.

Review the first image as an introduction and the last image as the end of the sequence. Keep text readable in the final canvas, and check the image order before saving. The preparation step creates a reusable carousel in your account; it does not publish it.

In the dashboard, open Carousel Posts to select files, move an image earlier in the order and save the set. You can prepare the images before choosing a publishing plan.

- [Open carousel preparation](https://agentgruvi.com/posts/carousel)

## Use the API upload sequence

Request a signed upload URL for each image with its file type and byte size. Upload the file directly to that URL with the matching Content-Type. Keep the returned imageKey in display order, then call POST /api/gruvi/carousels with the title, caption and ordered imageKeys.

The image keys must belong to the authenticated account and come from the carousel upload flow. Arbitrary external image URLs are not accepted. Your Gruvi bearer key belongs on the API requests, not on the signed storage PUT.

- [Allocate an image upload](https://agentgruvi.com/docs/api-reference#createCarouselUpload)

- [Save the ordered carousel](https://agentgruvi.com/docs/api-reference#createCarousel)

## Publish now or choose a future time

Select one connected Instagram account, TikTok account or Facebook Page. An immediate publication includes platform, accountId and a stable requestId. To schedule instead, send the saved carousel ID, one destination and a future scheduledTime to its schedule endpoint.

If you want to send the same images to a second destination, create a separate operation with that account and its own request ID. This keeps delivery results and retries unambiguous for each network.

- [Publish a carousel](https://agentgruvi.com/docs/api-reference#publishCarousel)

- [Schedule a carousel](https://agentgruvi.com/docs/api-reference#scheduleCarousel)

## Check whether it is live or waiting for review

TikTok defaults to creator-inbox review, so a successful send can produce a draft that you must finish inside TikTok. Do not report that draft as a live post. Direct publishing also depends on the account and application permissions available for that platform.

After an uncertain immediate send, read the carousel publication using the same requestId before retrying. The MCP tools gruvi_upload_carousel, gruvi_publish_carousel, gruvi_schedule_carousel and gruvi_get_carousel_publication cover those same stages.

- [Inspect a carousel publication](https://agentgruvi.com/docs/api-reference#getCarouselPublication)
