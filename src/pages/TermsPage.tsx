import React from "react";
import { Link } from "react-router-dom";
import LegalPage, { LegalSection } from "../components/LegalPage";

const sections: LegalSection[] = [
  {
    id: "service",
    title: "The service",
    content: (
      <>
        <p>
          Gruvi is operated by WB Tech Ventures LLC ("Gruvi", "we", "us" or
          "our"). These Terms apply to agentgruvi.com, the Gruvi dashboard, our
          HTTP API, the Gruvi MCP server and related publishing services.
        </p>
        <p>
          Gruvi distributes finished video content. You can upload videos and
          custom thumbnails, add captions and tags, connect social accounts,
          publish immediately, schedule posts and inspect delivery results.
          Available analytics currently cover connected TikTok and YouTube
          accounts. You can use the dashboard manually, an authorised agent, or
          both.
        </p>
        <p>
          Features depend on account permissions, platform availability and your
          plan. Read the <Link to="/docs/social">platform guide</Link> for
          supported formats and publishing settings. A platform may limit a
          format, choose its own thumbnail or require additional permissions.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Accounts and eligibility",
    content: (
      <>
        <p>
          You must be at least 13 and have the legal capacity to accept these
          Terms, or the permission of a parent or guardian where required. If
          you use Gruvi for a business or another person, you must have
          authority to act for them.
        </p>
        <p>
          Provide accurate account information, complete required verification
          and keep your password and agent keys private. You are responsible for
          the activity you authorise through your account. Contact{" "}
          <a href="mailto:admin@wbtechventures.com">admin@wbtechventures.com</a>{" "}
          promptly if you suspect unauthorised access.
        </p>
      </>
    ),
  },
  {
    id: "agents",
    title: "Agents, keys and authorisation",
    content: (
      <>
        <p>
          Agent access is optional. Creating a key authorises the client that
          holds it to use the account features available through that key. This
          can include reading account or media information, uploading content,
          publishing, managing schedules, inspecting analytics and requesting
          billing links.
        </p>
        <p>
          Only give keys to clients you trust. You are responsible for the
          instructions, content, destination accounts, timing and platform
          settings supplied by you or your agent. Configure any approval steps
          you require in your workflow. Gruvi does not require a separate human
          confirmation for every API request made with a valid key.
        </p>
        <p>
          You can revoke keys in Agent access. Revocation prevents future
          authenticated requests with that key; it does not automatically cancel
          a schedule already created or undo a post already sent. Third-party
          agent clients have their own terms and privacy practices.
        </p>
      </>
    ),
  },
  {
    id: "publishing",
    title: "Publishing and scheduling",
    content: (
      <>
        <p>
          Review the content, account targets, visibility, caption and settings
          before sending. A publishing request may become public or be delivered
          to a platform's creator inbox, depending on your choices and the
          integration.
        </p>
        <p>
          A successful upload or accepted schedule is not confirmation that a
          social platform has published the post. Processing, moderation,
          account restrictions, expired permissions, platform limits and outages
          can delay or prevent delivery. Results can differ between
          destinations.
        </p>
        <p>
          Check delivery status and available post links. If a request times
          out, inspect the existing video or schedule before retrying to avoid
          duplicate posts. Cancel a pending schedule before processing starts.
          Removing media, disconnecting an account, signing out or revoking an
          agent key is not a substitute for cancelling that schedule.
        </p>
        <p>
          Deleting content from Gruvi does not delete copies already published
          to a social platform. Manage those copies on the destination platform.
        </p>
      </>
    ),
  },
  {
    id: "billing",
    title: "Subscriptions and billing",
    content: (
      <>
        <p>
          You can set up an account, connect channels, upload media, configure
          an agent and explore the calendar without subscribing. Submitting a
          post for immediate publishing or scheduling requires active paid
          access.
        </p>
        <p>
          Plan prices, billing intervals, included allowances and applicable
          taxes are shown on the <Link to="/pricing">pricing page</Link> and at
          checkout. Subscriptions renew for the selected billing period until
          cancelled. By completing checkout, you authorise the recurring charges
          described there.
        </p>
        <p>
          Stripe processes payments and subscription management. A checkout link
          created through an agent is an invitation to complete payment, not a
          completed purchase or an activated plan. Use the hosted checkout
          rather than giving payment-card information to an agent or sending it
          in chat.
        </p>
        <p>
          The monthly scheduled-post allowance counts schedules created during
          the calendar month, excluding cancelled schedules. One schedule can
          target multiple connected accounts. Immediate publishing, API use and
          platform activity remain subject to reasonable service limits, abuse
          protections and destination-platform limits.
        </p>
        <p>
          Existing subscriptions can retain earlier prices until changed. New
          plan prices do not automatically migrate an existing subscription.
        </p>
      </>
    ),
  },
  {
    id: "cancellation",
    title: "Cancellation and billing questions",
    content: (
      <>
        <p>
          Manage or cancel your subscription through Plan &amp; Billing, or
          contact us if you cannot access billing management. The cancellation
          flow shows when the change takes effect. Access ordinarily continues
          for the remainder of a paid period unless another timing is shown or
          access is suspended for a reason covered by these Terms.
        </p>
        <p>
          Cancellation stops future renewal according to the displayed timing;
          it does not by itself issue a refund, cancel pending social posts or
          delete your account. Contact us about mistaken charges, an earlier
          purchase or a refund request. Applicable law and any purchase-specific
          terms govern your rights, including rights that cannot be waived.
        </p>
      </>
    ),
  },
  {
    id: "content",
    title: "Your content and permissions",
    content: (
      <>
        <p>
          You retain the rights you hold in the videos, thumbnails, captions and
          other material you submit. You grant us a non-exclusive licence to
          host, copy, process, transmit and display that material as needed to
          operate Gruvi and carry out your instructions, including delivery to
          the platforms you select.
        </p>
        <p>
          You must have the permissions needed for the material you upload and
          publish, including intellectual-property rights and any required
          permission from people whose image, voice or personal information
          appears in it. Make any advertising, commercial-content or
          synthetic-media disclosures required by law or a platform.
        </p>
        <p>
          We do not acquire ownership of your content through these Terms.
          Destination platforms receive content under their own terms,
          permissions and privacy settings. The limited service licence
          continues only as necessary to provide the service, complete requested
          operations and meet the retention purposes described in our{" "}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: "platforms",
    title: "Third-party platforms",
    content: (
      <>
        <p>
          Connected services include YouTube, Instagram, TikTok, Facebook,
          LinkedIn and X. You must comply with their rules, account requirements
          and publishing restrictions. Their features, APIs, processing times
          and decisions are outside Gruvi's control.
        </p>
        <p>
          Gruvi uses YouTube API Services. By using Gruvi's YouTube features,
          you also agree to the{" "}
          <a
            href="https://www.youtube.com/t/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube Terms of Service
          </a>
          . Google's handling of information is described in the{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy Policy
          </a>
          .
        </p>
        <p>
          Connecting an account authorises Gruvi to maintain the connection,
          carry out requested publishing and retrieve the account, delivery and
          supported analytics data needed for the features you use. Disconnect
          through Connected accounts or revoke access in the platform's own
          settings. Disconnecting does not remove published posts or necessarily
          stop an operation already in progress.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>
          Use Gruvi lawfully and with respect for other people and the services
          you connect. You must not:
        </p>
        <ul>
          <li>
            Upload or distribute unlawful material, malware, fraud, prohibited
            exploitation, harassment or content that infringes another person's
            rights.
          </li>
          <li>
            Publish to accounts you do not control or have permission to manage,
            impersonate others deceptively, or use another person's credentials
            without permission.
          </li>
          <li>
            Send spam, manipulate engagement, evade platform safeguards or
            bypass Gruvi's access controls and usage limits.
          </li>
          <li>
            Expose another person's private information without a lawful basis,
            or use the service for unlawful surveillance.
          </li>
          <li>
            Interfere with the service, exploit vulnerabilities or resell
            unauthorised access to accounts or credentials.
          </li>
        </ul>
        <p>
          Report suspected misuse or rights violations to{" "}
          <a href="mailto:admin@wbtechventures.com">admin@wbtechventures.com</a>
          , with the relevant URLs, a description of the issue and a way to
          contact you.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy and account controls",
    content: (
      <>
        <p>
          Our <Link to="/privacy">Privacy Policy</Link> explains account
          information, uploaded media, connected-platform data, agent access,
          billing, cookies and data requests.
        </p>
        <p>
          You can update supported profile fields, change email preferences,
          disconnect accounts and revoke agent keys in the dashboard. Contact us
          to request account deletion or assistance with stored data. Cancelling
          a subscription and deleting account data are separate requests.
        </p>
      </>
    ),
  },
  {
    id: "availability",
    title: "Availability and service changes",
    content: (
      <>
        <p>
          We aim to keep Gruvi useful and available, but cannot guarantee
          uninterrupted service, a particular publishing time, platform
          acceptance, audience reach or engagement. Scheduled times are
          execution instructions, not guaranteed publication deadlines.
        </p>
        <p>
          We may maintain, change or retire features, integrations and limits.
          Where a material change affects a paid service, we will provide notice
          as required by applicable law. A third-party restriction or an urgent
          security issue may require an immediate change.
        </p>
      </>
    ),
  },
  {
    id: "suspension",
    title: "Suspension and termination",
    content: (
      <>
        <p>
          We may restrict access where reasonably necessary to address misuse,
          unauthorised access, unpaid charges, fraud, legal requirements or a
          threat to the service or other people. You can stop using Gruvi and
          request closure of your account.
        </p>
        <p>
          Suspension can affect pending publishing jobs. Contact us if you
          believe a restriction is mistaken. Records may be retained for the
          purposes described in the Privacy Policy, and content already
          delivered to other platforms remains subject to those platforms'
          controls.
        </p>
      </>
    ),
  },
  {
    id: "responsibility",
    title: "Responsibility and legal rights",
    content: (
      <>
        <p>
          To the extent permitted by law, the service is provided on an "as is"
          and "as available" basis. You remain responsible for reviewing your
          content, instructions and destination settings.
        </p>
        <p>
          Subject to rights and liabilities that cannot lawfully be excluded, we
          are not responsible for losses caused by instructions you authorise,
          third-party platform decisions, or interruptions and failures beyond
          our reasonable control. Nothing in these Terms excludes liability or
          limits consumer rights where applicable law does not permit it.
        </p>
      </>
    ),
  },
  {
    id: "changes-contact",
    title: "Updates and contact",
    content: (
      <>
        <p>
          We may update these Terms as Gruvi changes. The date at the top
          identifies this version. We will provide notice of material changes
          through the service or account contact details where required. If a
          change requires renewed agreement, we will request it before it
          applies.
        </p>
        <p>
          Questions about these Terms, billing or account access can be sent to
          WB Tech Ventures LLC at{" "}
          <a href="mailto:admin@wbtechventures.com">admin@wbtechventures.com</a>
          .
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      path="/terms"
      description="Gruvi's terms for manual and agent publishing, social accounts, subscriptions, content rights, scheduling, cancellation and responsible API use."
      intro={
        <p>
          These Terms cover Gruvi's dashboard, publishing API and MCP server. By
          creating an account or using the service, you agree to them. Read our{" "}
          <Link to="/privacy">Privacy Policy</Link> to understand how
          information is handled.
        </p>
      }
      sections={sections}
      related={{ path: "/privacy", title: "Privacy Policy" }}
    />
  );
}
