import React from "react";
import { Link } from "react-router-dom";
import LegalPage, { LegalSection } from "../components/LegalPage";
import CookiePreferencesButton from "../components/CookiePreferencesButton";

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          Gruvi is a content distribution service operated by WB Tech Ventures
          LLC. This policy covers agentgruvi.com, the dashboard, the publishing
          API, the Gruvi MCP server and related services. Contact us at{" "}
          <a href="mailto:admin@wbtechventures.com">admin@wbtechventures.com</a>{" "}
          about privacy or your information.
        </p>
        <p>
          It describes how we handle information when you work manually or
          authorise an agent. Social platforms, payment providers and
          third-party agent clients also process information under their own
          policies.
        </p>
      </>
    ),
  },
  {
    id: "information",
    title: "Information we handle",
    content: (
      <>
        <ul>
          <li>
            <strong>Account and login information:</strong> email address,
            username, profile name, verification status, login-provider
            identifiers, profile image when provided, email preferences and
            authentication records. Password-based accounts use a password hash
            rather than a readable stored password.
          </li>
          <li>
            <strong>Your content:</strong> uploaded videos, thumbnails, titles,
            captions, tags, media identifiers, technical file information and
            media links.
          </li>
          <li>
            <strong>Publishing instructions and results:</strong> destination
            accounts, schedule times, privacy and disclosure settings, job
            identifiers, delivery states, returned post links and platform
            errors.
          </li>
          <li>
            <strong>Connected-account information:</strong> platform and account
            identifiers, account or page names, profile images, granted
            permissions, access or refresh tokens, connection status and
            supported analytics.
          </li>
          <li>
            <strong>Agent-access records:</strong> key identifiers, names,
            creation and usage information, and the requests made using
            authorised keys. Agent keys can provide account access, so keep them
            private.
          </li>
          <li>
            <strong>Billing records:</strong> plan, subscription status, billing
            periods, Stripe customer and subscription identifiers, payment or
            invoice references and related support information. Stripe handles
            payment-card entry.
          </li>
          <li>
            <strong>Technical and support information:</strong> IP addresses,
            browser or device information, session identifiers, requests,
            errors, security events and messages you send to support.
          </li>
        </ul>
        <p>
          Optional website analytics and advertising measurement can also
          collect device identifiers, page interactions and conversion events,
          as described under Cookies and measurement.
        </p>
      </>
    ),
  },
  {
    id: "purposes",
    title: "How we use information",
    content: (
      <>
        <p>
          We use information to authenticate you, maintain your account, store
          your media, connect social profiles, carry out publishing
          instructions, manage schedules, display delivery results and provide
          supported analytics. We also process billing, provide support, send
          account or security messages, investigate abuse and meet legal
          obligations.
        </p>
        <p>
          Where data-protection law requires a legal basis, these purposes can
          include performing our service agreement, complying with legal
          obligations, operating and securing the service under legitimate
          interests, and consent for optional processing. You can withdraw
          optional cookie consent without closing your account.
        </p>
      </>
    ),
  },
  {
    id: "agents",
    title: "Agents and the MCP server",
    content: (
      <>
        <p>
          Agent access is optional. You can use the dashboard without setting up
          an agent. If you create and share a key, its holder can use the
          account capabilities exposed by the API, including content,
          connected-account information, schedules and supported analytics.
        </p>
        <p>
          The Gruvi MCP server runs locally in your chosen MCP client and sends
          authenticated requests to the Gruvi API. A third-party agent or client
          may receive your instructions, media paths or URLs, account
          information and tool responses. Its provider's terms and privacy
          settings govern its handling of that information.
        </p>
        <p>
          Review the client you choose, store credentials in its secret settings
          and revoke keys you no longer need in{" "}
          <Link to="/agents">Agent access</Link>. Revoking a key does not
          automatically cancel posts it has already scheduled. We do not collect
          card details through MCP; billing tools return Stripe-hosted checkout
          links.
        </p>
      </>
    ),
  },
  {
    id: "platforms",
    title: "Connected social platforms",
    content: (
      <>
        <p>
          When you connect a profile, Gruvi uses the platform's authorisation
          flow. We receive the permissions and account information returned by
          the platform and store the credentials needed to maintain the
          connection and perform the features you request. We do not ask for
          your social-platform password in Gruvi.
        </p>
        <p>
          Videos, thumbnails and post metadata are sent to the destinations you
          or your authorised agent select. We retrieve the account details and
          processing results needed for connection management, publishing and
          delivery tracking. TikTok and YouTube integrations also retrieve
          supported account and video analytics.
        </p>
        <h3>YouTube and Google</h3>
        <p>
          Gruvi uses YouTube API Services for channel connection, video uploads,
          publishing status and available channel or video analytics. Google
          Sign-In can provide your name, email address, account identifier and
          profile image for authentication and your account.
        </p>
        <p>
          Our handling of Google API data follows the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including its Limited Use requirements. Connected YouTube API data
          is used for the user-facing features you request, not for advertising
          targeting or training generative AI models. Google also processes
          information under its{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          .
        </p>
        <p>
          Disconnect YouTube in Connected accounts or revoke Gruvi's permission
          through your{" "}
          <a
            href="https://security.google.com/settings/security/permissions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google account's security permissions
          </a>
          . Contact us to request deletion of stored YouTube API data.
          Provider-specific retention and deletion requirements apply to that
          data.
        </p>
        <h3>TikTok</h3>
        <p>
          We handle account and profile information, publishing credentials,
          submitted videos and metadata, delivery or creator-inbox results, and
          supported account or video analytics. Your selected delivery mode,
          privacy, interaction and disclosure settings determine the publishing
          request.
        </p>
        <h3>Instagram and Facebook</h3>
        <p>
          We handle eligible profile or page identifiers, names, profile images,
          connection credentials, uploaded content and publishing results needed
          to post videos to the connected destinations.
        </p>
        <h3>LinkedIn and X</h3>
        <p>
          We handle connected-account identifiers and profile information,
          authorisation credentials, submitted videos and captions, and the
          publishing results available from each platform.
        </p>
        <p>
          You can disconnect profiles in{" "}
          <Link to="/settings/connected-accounts">Connected accounts</Link> and
          manage permissions on the platform itself. Disconnection does not
          remove posts already published there or erase every related record
          from Gruvi; request stored-data deletion separately.
        </p>
      </>
    ),
  },
  {
    id: "providers",
    title: "Service providers and disclosures",
    content: (
      <>
        <p>
          Information is shared where needed to deliver the service and the
          features you choose:
        </p>
        <ul>
          <li>
            <strong>Amazon Web Services:</strong> hosting, media storage,
            account and publishing records, job processing, operational logs and
            service communications.
          </li>
          <li>
            <strong>Stripe:</strong> checkout, subscriptions, billing
            management, payments and fraud-related signals. We provide billing
            contact information, account references and the selected plan.
            Stripe handles payment details under its{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            ; Gruvi does not store full card numbers or card security codes.
          </li>
          <li>
            <strong>Google and Firebase:</strong> optional Google authentication
            and website analytics or measurement when enabled by your choices.
            Google's own services have their own privacy terms.
          </li>
          <li>
            <strong>Cookiebot and Cloudflare Turnstile:</strong>{" "}
            cookie-preference management and signup abuse prevention. These
            services can process browser, device, IP and interaction signals
            needed for those functions.
          </li>
          <li>
            <strong>Social platforms and agent clients:</strong> the information
            described above when you connect them or authorise actions.
          </li>
        </ul>
        <p>
          Authorised personnel and service providers may access information to
          operate the service, investigate an issue or respond to your support
          request. We may also disclose information where law requires it, to
          address fraud or safety issues, or as part of a business transfer
          subject to applicable protections.
        </p>
        <p>
          We do not sell your uploaded media or connected-account credentials.
          Optional advertising measurement may share device and interaction
          information with Google when enabled. Privacy laws can define "sale"
          or "sharing" more broadly than a payment for data; use the choices
          below to control optional tracking.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and measurement",
    content: (
      <>
        <p>
          Necessary cookies and browser storage support sign-in, account state,
          security and your cookie choices. Signing out clears active
          authentication information, but your browser can retain preferences or
          other site storage until you clear it.
        </p>
        <p>
          With statistics consent, Firebase or Google Analytics can collect
          usage events and device or session identifiers. With marketing
          consent, configured Google measurement can receive conversion or
          advertising signals. These events are not necessarily anonymous and
          may be associated with account identifiers.
        </p>
        <p>
          Optional analytics collection waits for a statistics choice.
          Advertising consent is handled separately. You can review or withdraw
          choices through Cookiebot's controls or the button below. If those
          controls are unavailable, use your browser's cookie settings or
          contact us. Essential authentication and security processing still
          operate when optional measurement is declined.
        </p>
        <CookiePreferencesButton />
        <p>
          Marketing emails have an unsubscribe option, and supported account
          email preferences are available in the dashboard. Essential account,
          billing and security messages may still be sent.
        </p>
      </>
    ),
  },
  {
    id: "media-security",
    title: "Media access and security",
    content: (
      <>
        <p>
          We use access controls and service-provider security features to
          protect account information, credentials and stored media. Access can
          be needed by authorised systems and personnel to run the service;
          uploaded content is not accessible only to its owner in every
          circumstance.
        </p>
        <p>
          Uploads, previews and platform delivery can use temporary signed media
          URLs. A person or service with a valid URL may be able to access that
          media until the URL expires. Treat those URLs as private unless you
          intend to share them.
        </p>
        <p>
          Publishing sends copies to another platform, where the visibility and
          platform's own practices apply. No system or transmission method can
          guarantee complete security. Keep passwords and agent keys private,
          and contact us about suspected unauthorised access.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Retention and deletion",
    content: (
      <>
        <p>
          We retain account records, media, schedules and delivery history as
          needed to provide your account and library, handle support and
          maintain the service. Billing, security and dispute records may need
          to be kept for legal, accounting, fraud-prevention or other legitimate
          operational purposes. Different record types can have different
          retention periods.
        </p>
        <p>
          To request account closure, a copy of your information, or deletion of
          stored personal or connected-platform data, email{" "}
          <a href="mailto:admin@wbtechventures.com">admin@wbtechventures.com</a>{" "}
          from your account email address and describe the request. We may need
          to verify that you control the account.
        </p>
        <p>
          Deletion is not necessarily immediate across backups, logs and records
          that must be retained. Cancelling billing, revoking an agent key,
          disconnecting a social account and deleting stored information are
          separate actions. Content already published to a third-party platform
          must also be managed there.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights and choices",
    content: (
      <>
        <p>
          Depending on your location and the applicable law, you may have rights
          to access, correct, delete or receive a copy of personal information,
          restrict or object to certain processing, withdraw consent, or
          complain to a data-protection authority. Some requests are subject to
          identity verification, legal exceptions or information we must retain.
        </p>
        <p>
          Use the dashboard for available profile, email, connection and
          agent-key controls. Contact us for other privacy requests or to ask
          about a response to your request. We do not require you to keep an
          active paid subscription to make a privacy request.
        </p>
      </>
    ),
  },
  {
    id: "international",
    title: "International processing",
    content: (
      <>
        <p>
          Gruvi and its providers can process information in the United States
          and other countries where they operate. Those countries may have
          different data-protection laws from your location. Contact us for
          information about processing locations and the safeguards applicable
          to your information.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's privacy",
    content: (
      <>
        <p>
          Gruvi is not directed to children under 13, and we do not knowingly
          collect their personal information. If you believe a child under 13
          has provided information to us, contact us so we can investigate and
          take appropriate action.
        </p>
      </>
    ),
  },
  {
    id: "updates-contact",
    title: "Updates and contact",
    content: (
      <>
        <p>
          We update this policy as the service and its data practices change.
          The date at the top identifies the current version. We provide notice
          of material changes through the service or account contact details
          where required, and request consent before a new use where consent is
          required.
        </p>
        <p>
          For questions, requests or complaints, contact WB Tech Ventures LLC at{" "}
          <a href="mailto:admin@wbtechventures.com">admin@wbtechventures.com</a>
          .
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      description="How Gruvi handles accounts, uploaded media, social-platform data, agent access, payments, cookies and privacy requests for its publishing service."
      intro={
        <p>
          Your content, social connections and agent access involve different
          kinds of information. This policy explains what Gruvi handles, why it
          is needed, who receives it and how to manage your choices.
        </p>
      }
      sections={sections}
      related={{ path: "/terms", title: "Terms of Service" }}
    />
  );
}
