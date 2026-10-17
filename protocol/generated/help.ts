// Generated from producer-owned guides, compiled ABI and module schemas.
import type {HelpBundle} from '@daclify/core-protocol';
export const ModulesHelpBundle={
  "producer": "modules",
  "packageVersion": "0.10.0-alpha.57",
  "interfaceVersion": 1,
  "topics": [
    {
      "id": "quick-ballots",
      "title": "Quick ballots: encrypted up/down questions",
      "paragraphs": [
        "Quick ballots provides experimental encrypted up/down voting on testnet. A current executive can open a question for permitted members of the originating encrypted DAO, or explicitly publish a question for active members of one to twenty selected DAOs or all Daclify accounts. Each canonical account has one current response; changing wallets or memberships does not add a vote. This is account uniqueness, not proof of one human per account.",
        "Write a question of up to 256 UTF-8 bytes and an optional explanation of up to 4096 bytes. Add a closing time or close manually. The current originating executives and their encryption public keys are fixed when the question opens. Every reader needs working private-content access; an uploaded key grant alone cannot prove they decrypted it. Other audience DAOs receive no reader keys.",
        "The browser encrypts each up/down response and proves it is a valid choice before signing. Private ballot keys, choices and randomness stay on the device. Your existing default approval method authorizes the exact response; enabling a wallet for account-wide ballots grants no DAO spending authority. A ballot retains at most 5000 response identities. The originating DAO funds its storage.",
        "Individual choices are encrypted, but account participation, timing, the public question and readers remain visible on-chain. Fixed readers can decrypt individual choices and copy their keys. Authorized managed recovery may also affect who can obtain a reader key. Removing current database links or on-chain rows does not erase historical chain transactions.",
        "After closure, bounded preparation freezes a complete ordered response commitment and independently checks the encrypted aggregate and count. A reader produces a public cryptographic proof of the final up/down totals locally. Pending totals are never presented as a result. The proof implementation has native and independent-vector tests; those tests are not an independent cryptographic security audit or mainnet qualification.",
        "Thirty days after closure, verified encrypted archiving and a separately verified backup permit bounded cleanup of individual response and reader-grant rows. The final summary, public key, aggregate, source root and protocol inputs stay on-chain. Missing tally keys leave No verified result; a valid proof may still arrive after cleanup. Archiving can proceed after DAO closure under this opening policy without finding a departed executive.",
        "Cleanup still requires the operator to enable pruning, current pinned source code, a fresh verifier attestation, exact row proofs and verified retained copies. Lost or corrupt archives block deletion. History nodes are an additional recovery source, not a promised permanent hosted archive.",
        "A private question and explanation use the originating DAO’s content keys and history grants. Individual vote decryption remains separate: only the executives fixed when opening receive the vote key. An eligible non-executive can read the question and respond without receiving anyone else’s vote key. Missing question keys or ciphertext blocks new votes, while removing an existing response remains available with its normal authorization.",
        "Definition format1 preserves legacy public questions. Format2 contains only an exact protected-question reference, an empty public explanation and the single originating DAO audience. Format3 explicitly publishes question wording. All formats retain the same proof system: the complete native definition, including the protected reference and format, is hashed into every key, response and final-tally context. No existing commitment is reinterpreted and no new circuit is introduced.",
        "Confidential multi-DAO and all-account questions are disabled. Changing the audience never silently makes wording public; the author must review the explicit public disclosure. Current readers use the versioned list/detail endpoints. Legacy list/detail endpoints return only supported format1 records and a client-update error for a newer definition, preserving old proof interpretation.",
        "The protected question version stays retained through closure. After 30 days and verified encrypted-response and reader-grant archiving, pruning releases its active document hold. Its exact reference and final proof inputs remain frozen on chain. Removing the underlying document still requires its separate verified document archive and existing cleanup authorization. Losing question keys does not expose individual votes or permit replacing the fixed vote readers."
      ]
    },
    {
      "id": "decide",
      "title": "Weights with an explicit snapshot",
      "paragraphs": [
        "Choose equal active member voting, internal governance credits, or deposited native stake. Pick quorum and approval thresholds before opening a ballot.",
        "A ballot snapshots its eligible denominator and highest member ID. Active ballots freeze issuance, stake changes, and reactivation so a voter cannot change their weight during voting.",
        "Closing and finalization are separate from execution. A passed proposal does not authorize arbitrary contract calls. Executors require bounded, explicitly configured effects.",
        "After the closing time, select Finalize ballot to calculate its result and release its expired governance lock. The service only forwards the reviewed Decide finalization action. Finalization is idempotent and remains available for a compatible, verified deployment after disabling new member actions.",
        "DAOs with a saved governance policy must use its exact ballot settings. A funding vote binds one proposed Works project and all milestone records; ordinary ballots remain advisory.",
        "Executive elections are opt-in: initialize a core executive policy and install the electexec grant. The reserved title Executives schedules a core roster handover at term start; the pending roster activates after eligible successor pairing and synchronization within its term. Other titles remain representative terms. The old roster retains control until a valid successor activates, and recall cannot remove the final paired native controller. Non-voting members are excluded from new ballot denominators and cannot cast votes.",
        "Confidential DAOs encrypt ballot titles, explanations and custom choice labels before publication. Metadata4 exposes ordered numeric indices and the exact protected document reference. The optional supporting document ID/version/hash is also public technical retention data; its contents can remain encrypted. Both exact versions are retained by the native document-reference system. Explicitly publishing wording publicly requires the disclosure checkbox; historical plaintext stays public.",
        "Binary proposals use Reject and Approve. Explicit advisory polls have two to sixteen distinct labels; either option can win a neutral two-option poll. Polls use the saved DAO quorum and approval threshold: the unique leading option must reach that threshold, so a simple plurality can fail. Ordinary ballots remain single-choice and once-only; advanced election methods are a separate release.",
        "Private metadata4 freezes proposal/poll semantics, numbered ordered choices and ciphertext references in the existing definition commitment. Read private ballot decrypts only the selected ballot with original account keys and the permitted DAO epoch grant; unavailable or inconsistent wording blocks voting. Public editor metadata3 and schema-one/two ballots preserve their recorded interpretation. Public title/explanation bounds remain160/2000 characters and custom choices80 characters, with4096-byte metadata; larger private envelopes use existing encrypted file uploads. Every new ballot requires votecommit over its frozen domain, metadata, policy and targets. An explicitly public ballot in a confidential DAO carries publicDisclosure:true.",
        "Funding ballots retain immutable opening snapshots of recipient, payments, due dates, contribution terms and exact supporting document commitments. Review those terms and verified supporting versions before voting. Export ballot and votes downloads the full domain, definition, target and every available live vote; partial-live explicitly excludes archived history.",
        "Private content references use ballotdefs document-source slots0/1. The protected body document ID equals its ballot ID; references pin the exact encrypted version, hash and epoch, with current-epoch publication. Definition markers and protected content remain with the ballot after finalization and vote-row archival. Bounded backfillrefs scans preserve these references across reviewed upgrades. Exports include technical definitions/references and public votes without decrypted wording. Sign-out, key lock and account/DAO changes clear local private presentations. Ordinary vote choices, participation and results remain public.",
        "Private ordinary definitions use marker version3; private funding definitions use version4 while retaining the exact version2 target snapshot rules. Existing version1/2 definitions, including arbitrary historical metadata, keep their original hash and authority. Bounded private-reference backfill visits only marked private definitions. Core supports at most five registered source families per module; the additional ballotdefs family needs one exact body reference and at most one supporting reference, without new tables or indexes."
      ]
    },
    {
      "id": "works",
      "title": "Fund work through milestones",
      "paragraphs": [
        "A proposal names a contributor, a deliverable reference, and bounded milestone payments. Funds must be reserved before commitment.",
        "Submission and review are separate permissions. A contributor cannot approve their own work. Optional protected terms require fresh contributor acceptance before funding; an administrator can permanently require protection for all future Works reservations, including Grants awards using that Works source. Existing funded work keeps its original rights.",
        "Approval records a backed obligation. A job retry or duplicate submission cannot create a second payment for the same milestone.",
        "Publish the proposal document, propose work, and have an administrator accept its funded milestones. The contributor publishes evidence and submits its document reference. A different active administrator or member with reviewer permission publishes a review reference and approves or requests changes. Approved payments are settled separately. Cancelling a project releases unapproved reservations while preserving approved payments.",
        "When governed Works funding is enabled, direct administrator acceptance is rejected. An approved funding ballot reserves the pinned project; contributor submission and independent review are still required before payment.",
        "Observed acceptance preallocates fixed submission and review reference slots before committing funds. Revision reuses those slots; bounded legacy adoptwork scans add missing pending slots. This supports references to documents that already exist when ordinary RAM is exhausted. New document contents, uploads and new funding commitments still require ordinary capacity. Financial settlement uses its reserved core receipt hold; full-claim withdrawal is the emergency exit, while partial withdrawals need ordinary RAM.",
        "Before protected funding, choose a different active backup member, a DAO executive representative and review, challenge, vote and backup deadlines. Member voting follows the frozen DAO voting rules and excludes the contributor and every participating reviewer. Reviews stay provisional during the challenge period; disputed outcomes pay the fixed milestone amount or cancel only its unpaid reservation.",
        "No valid vote or no eligible electorate leaves funds reserved until the agreed backup deadline. After both decision stages expire, only matching contributor and fixed DAO representative consent resolves the reserve. An inactive contributor can still consent to this final settlement using their current signing proof. Already approved claims remain payable. Private evidence requires existing registered key grants for decision makers, and verified decryption remains a separate user requirement.",
        "The service catalogue publishes validated public or encrypted service offers using normal DAO documents. Private offers are read in explicit batches of 25 and clear from the screen when keys lock. Exact version links return to the originating DAO page.",
        "Large courts prepare eligible voters in bounded steps. The UI completes the preparation through one action and shows a resume option after interruption; voting remains locked until the entire frozen membership boundary is processed. Expired or empty preparation produces no approved payment. Preparation needs ordinary storage capacity; its failure leaves funded reserves under the agreed backup/mutual-settlement safeguards.",
        "After publishing a contributor-project template, Use in a new Works proposal selects only its exact document/version/commitment. The link contains no agreement text or party details and signs nothing. Verify the contributor, integer payments, dates and agreement wording in the existing form; normal contributor consent, protected terms and funding approvals still apply.",
        "Generated prose does not compile into native obligations. Existing projects retain their immutable document terms: a revised agreement needs an explicitly reviewed successor proposal unless the existing reference already matches. No template handoff changes earlier claims, milestone decisions or funding."
      ]
    },
    {
      "id": "payroll",
      "title": "Funded payroll with a clear end date",
      "paragraphs": [
        "A payroll commitment names a DAO contributor, exact native-token amount, start date, payment interval and a bounded number of installments. The full term must be funded before commitment.",
        "Committed installments are approved liabilities. They remain payable after module removal, account offboarding or subscription expiry. Settlement after its due time is separate from approval.",
        "This initial contract uses fixed terms of at most twelve installments. Renewal is a new funded commitment. It does not promise an unfunded, automatically renewable salary.",
        "Choose a future first-installment time in UTC. The interval between installments is the claim frequency. The UI shows each installment’s due time, the schedule label, whether settlement is paused, and the core obligation state. Once due, settlement remains available after payroll is disabled; disabling the module prevents new commitments and does not cancel an approved term.",
        "One settlement pays every installment that is already due, oldest first, and leaves any later installment unpaid. Pausing a schedule stops the payroll settlement helper until an administrator resumes it. It does not stop direct Treasury payment of an approved, due obligation. Only the separate DAO guardian pause blocks those obligation payments. Pause and the last payout time remain after the module is removed. An administrator can change the short label without changing the funded amount, the recipient, or the interval. The recipient is the member stored on the approved obligation, and the only treasury is the DAO treasury in its configured asset. A direct treasury payment can still pay one approved obligation and does not apply this schedule.",
        "New commitments require an agreed name and exact terms document commitment before reserving funds. Renew with fresh funding creates one separately funded successor for the same recipient after the previous term, preserving all earlier installment claims. Retries cannot create a second successor. A later display-label edit does not change the immutable agreed name or document terms. All-paid reference cleanup retains the successor marker.",
        "With the matching private-label capability enabled, new encrypted DAO payroll names live in encrypted DAO documents. The agreed name is pinned to the immutable term. An editable display name has a separate reference; changing it preserves the agreed name, payment amount, recipient, installment dates and pause state. Public chain rows use Private payroll. Read names on demand with the original account keys and permitted DAO history grants.",
        "Private names do not hide financial records, recipients or payment timing. Missing content or keys makes a name unavailable and must never stop an existing approved payment claim. Legacy agreed names remain public in their original term rows and history. Encrypted name references can be released only after every installment is settled; document pruning still requires its existing verified archive and retention checks."
      ]
    },
    {
      "id": "module-reference",
      "title": "Read the matching module reference",
      "paragraphs": [
        "Each reference bundle identifies the module package and interface version it describes. The module read API reports deployment versions, configured permissions and code verification alongside current ballots, projects and payroll entries.",
        "The configuration reference is generated from the producer's validation schemas. Decide settings are selected for each ballot. Works currently uses a fixed limit of sixteen milestones and independent review; payroll uses a fixed limit of twelve installments. Installing a module does not yet persist custom Works or payroll settings.",
        "Generated action and table fields describe serialized structure. They do not replace the contributor, reviewer, funding, timing and authorization rules in the explanatory guides. A code or version mismatch must be resolved before relying on a guide for an installed deployment.",
        "Core now persists the DAO ballot policy and commitment limits. Module installation does not provide arbitrary custom Works or payroll policies. The executor supports only a specific Works project, not arbitrary contract calls.",
        "Module history is paged by DAO and related parent records. Continue using each non-null next cursor; use done for a collection that is complete. A continuation page can contain no records for your DAO while still providing an advancing cursor through shared primary rows. Votes are returned for the requested member, not all shared votes. Disabled installations remain readable so old obligations and ballot finalization are not lost. Signing controls require active membership, unlocked keys and the exact installed action grant."
      ]
    },
    {
      "id": "governed-funding",
      "title": "Vote on a specific Works project",
      "paragraphs": [
        "Publish the deliverable reference, propose milestone work, then select Propose funding vote. The contract opens a binary vote using the DAO policy and pins the project, contributor, document version, milestone amounts and due times, runtime, module code and policy revision.",
        "After closing, finalize the ballot. Only a passed, finalized result can execute. Execute approved funding reserves all milestones atomically and at most once. A failed reservation rolls back the execution flag. The native contract accepts permissionless execution; the hosted API requires a signed-in account and applies sponsorship limits.",
        "Execution expires seven days after the scheduled closing time. Changed or cancelled projects, a changed policy revision, missing modules, replaced code, a guardian pause or insufficient funding prevent execution. A second passed ballot for an already funded project cannot reserve it again.",
        "Funding approval does not approve a deliverable. The contributor submits evidence and a different administrator or reviewer accepts it before settlement. Distinct member keys do not prove different operators; admission and review policy must address conflicts. Existing approved liabilities remain payable after module removal, subject to a temporary guardian pause.",
        "Advisory ballots cannot be repurposed as funding authority. There is no arbitrary-action executor, game-result oracle, secret ballot or independent-operator verification in this release."
      ]
    },
    {
      "id": "contribution-agreements",
      "title": "Contribution agreements and member services",
      "paragraphs": [
        "Start in Documents: publish a scope/deliverables document, encrypted for a private DAO. Propose a Works project with contributor, native milestone amounts and due dates. Offer a contribution agreement on that proposed project and set a term containing every milestone due date (maximum one year).",
        "The designated active contributor must sign agreement acceptance. Consent commits the exact document version/content commitment, project/contributor, native milestone amounts/dues and term. A funding vote or administrator acceptance cannot reserve an unaccepted agreement. Funding still requires the DAO policy and full backing.",
        "Review belongs to the actual DAO reviewer/admin team. Contributors cannot review their own work, even if they hold a reviewer role. Cancellation preserves already approved obligations; use a successor project and fresh consent for changed terms. Existing ordinary Works projects need no new agreement record.",
        "A version 1 contribution-agreement document includes type, dao reference, contributor, title, scope, deliverables, optional roleTitle, term {start,end} in native epoch seconds, native asset reference, milestones [{amount,due}] in integer base units, reviewPolicy dao-review-team and cancellationPolicy preserve-approved-liabilities. Terms shown on chain govern the enforced money flow. Narrative role titles grant no privileges and this is not legal contract certification.",
        "A public version 1 service-offer document includes type service-offer, dao reference, memberId matching its author, title, summary and skills. The catalogue reads the latest authored public JSON document from active members. Choose an offer to prefill a Works contributor. Encrypted narratives stay in Documents; a service listing holds no funds and is separate from the platform module Marketplace.",
        "Milestone agreements and Payroll are separate compensation lifecycles. Do not fund both for the same work period. Basic proposal, consent, evidence, review, claim and export remain free; optional hosted reminders and dashboards cannot revoke approved liabilities.",
        "An upgrade changes a module code hash. Existing project/milestone rows and liabilities are preserved. A pending code-pinned funding plan needs renewed authorization against the reviewed upgrade; a preserved document commitment alone does not authorize a changed executable."
      ]
    },
    {
      "id": "grants-rounds",
      "title": "Apply for a fully backed grant",
      "paragraphs": [
        "An administrator freezes rules and document versions, native-asset lifetime award cap, participant eligibility and application/review/award deadlines. A cap reserves no Treasury funds. Matching and donor pots are not part of these rounds.",
        "The applicant creates or amends their own application with exact document version, native milestone payments and due dates, and a bounded contribution term. Submit application is explicit consent to those terms. Amendment increments revision and removes consent and eligibility; submit and review again.",
        "An administrator reviews eligibility using a decision document. Eligibility authorizes no spending. A Decide award vote pins the application revision/commitment, DAO policy and grant/Works code. Only a passed finalized vote can execute before the award cutoff.",
        "Execution atomically checks the round cap, creates a Works agreement accepted by the applicant submission and reserves every milestone from real Treasury funds. If any cap, backing, identity, policy or code check fails, nothing is awarded or reserved. Delivery, independent review, cancellation and once-only settlement then use Works and Treasury.",
        "Awarded is the cumulative committed award amount, not a current cash balance. Cancellation does not reopen the lifetime cap. Private narrative belongs in encrypted Documents; on-chain terms, membership, votes and asset amounts remain public. Changing the application or review invalidates its earlier vote.",
        "Protected applications require the contributor to approve the exact voting rules, backup and deadlines before submission. Amendment clears that consent and eligibility review. Award execution transfers the approved protected terms to Works; funding ballots preserve the original application revision and readable payment snapshot."
      ]
    },
    {
      "id": "endorsement-admission",
      "title": "Join with member endorsements",
      "paragraphs": [
        "Administrator admission remains the default. Enable the endorsement module, then an administrator explicitly sets the core admission policy, threshold (1–20), whether agents may endorse and an optional administrator override. The override is disabled by default. Owners and signed administrator admission cannot bypass a policy without that disclosed override.",
        "A current member sponsors the applicant’s public join identity and exact application document version, kind/operator and expiry. Verify the public keys through a trusted channel. Applications last at most 30 days. Sponsoring is not proof of unique personhood; multiple paired credentials add no endorsement weight.",
        "Distinct current eligible member IDs endorse an exact revision; they can withdraw their endorsement before admission. Amending or renewing by the same sponsor increments the revision and clears old endorsements. A policy revision invalidates earlier applications. At most 64 endorsements are stored; amend to reset a stale list if needed.",
        "Admission rechecks current active, guardian-revoked and self-endorsement status, threshold, expiry, source code pin and complete identity. The authenticated module callback adds one ordinary member once. It cannot assign roles, issue credits or reserve assets. Native or EVM wallet governance authorization is activated separately after joining.",
        "DAO administrators may change the admission policy or explicitly enable administrator override. Member endorsement is a configurable admission rule, not a unique-human guarantee. Private membership grants and history access remain separate approvals; admission itself decrypts no documents."
      ]
    },
    {
      "id": "representative-elections",
      "title": "Elect representatives for a fixed term",
      "paragraphs": [
        "An administrator creates a named representative election, exact rules document version, future nomination cutoff, one to eight seats and a term of at most one year. The term must allow the saved DAO voting duration after nominations close. Candidate and voter identities are stable member IDs; paired logins add no votes.",
        "For a DAO using protected identity metadata, describe a representative office inside the encrypted rules document. Its public title is Office. The reserved Executives title retains its existing authority and roster meaning. Historical public titles remain public in rows and chain history.",
        "Each active member nominates only themselves or withdraws before the cutoff. At most fifteen current eligible candidates plus the abstention choice enter voting. Withdrawal removes a nomination slot. Inactive or guardian-revoked nominations can be cleared when another member nominates. There is no random group assignment or meeting attendance oracle.",
        "After nominations close, any active member may start the election before the term’s start. A changed policy revision prevents starting; schedule a successor election with reviewed rules. Starting freezes the sorted candidate IDs, exact DAO quorum/weight and normal voting denominator/highest member snapshot. One member votes once for one candidate or explicit abstention.",
        "Finalization requires the frozen quorum; the yes/no approval majority is not used to rank candidates. Positive candidate tallies rank by weight. A tied group is installed only when the whole group fits remaining seats; a tie crossing the seat boundary leaves those seats vacant. No quorum or abstention-only voting creates no terms. Inactive or revoked winners leave their ranked seats vacant, without promoting a runner-up. Finalizing after the term ends creates no terms.",
        "A durable term records its exact start/end and recall. The term window starts no earlier than that date; actual membership must remain eligible. An administrator can recall a term with a reason document. Titles grant no administrator flag, reviewer permission, module power, credit issuance or Treasury authority. Permanent roles and approved liabilities remain separate and survive term expiry.",
        "Vote and finalize in Decide. Representative terms are read-only mandates unless a future separately reviewed bounded authority module is explicitly installed. Delegated budgets and fractal elections remain outside this release.",
        "On an observed development deployment, starting an election physically allocates the maximum term-row space for its approved seats and exact title. Finalization consumes that hold before issuing actual terms; an unsuccessful election releases it. This changes no permanent roles or voting weights. Legacy election adoption, DAO quota enforcement and live deployment remain separate release gates."
      ]
    },
    {
      "id": "archive",
      "title": "Archive exports and recovery — development",
      "paragraphs": [
        "The Archive format library binds packed records to their DAO, source code, released schema, table and snapshot domain. Bounded chunks, canonical manifests and index-derived proofs protect record integrity. Core hosts resumable ordinary-poll exports, complete storage reservations and verified recovery downloads. Core can additionally create an authenticated encrypted backup, restore it independently and record an immutable receipt when the operator configures a separate backup store. The development runtime can additionally anchor one bounded ordinary-poll export, record restricted availability attestation and accept the administrator's exact signed approval or revocation. Bounded ordinary-poll source pruning and on-chain discovery/browsing are implemented in development, with destructive production use separately gated.",
        "Ordinary polls have a parallel terminal marker using actual finalization time. Marking an old finalized poll is native operator maintenance: its migration timestamp starts a fresh 90-day wait and retries never change it. Closing time is not finalization time. The bounded ordinary-poll planner checks age, code/schema/domain, complete vote/tally coverage and exclusions for work, grants and elections. Its output never authorizes pruning; the host still must verify irreversible state, storage and independent backup, and obtain matching native administrator approval.",
        "A valid proof does not establish file availability or authorize deletion. Source contracts must independently check approval, eligibility, references and the qualified schema before pruning. Identities, key grants, liabilities and financial replay guards stay live.",
        "Archived files remain pinned and use ordinary approved storage capacity. The approved launch policy is 100 MB free and $1 per additional approved 1 GB monthly; core has explicitly approved prepaid storage subscriptions behind configuration, while live provider qualification and destructive retention enforcement remain pending. Original private ciphertext requires the original decryption keys.",
        "In Resources, active administrators select a finalized poll, preview its eligibility and approve the displayed maximum stored-byte reservation. Export uses existing hosting capacity and creates no subscription or pruning approval. Source changes require a new preview; a newer irreversible snapshot alone does not alter consent. Saved exports survive page/server restarts. Refresh advances bounded work; uncertain provider outcomes keep their holds. The original requesting administrator must remain authorized for completion.",
        "Download the verified recovery bundle and store its displayed manifest SHA-256 separately, off the server. Standalone verification requires that expected commitment and the matching qualified schema package, not a hash supplied only by the file itself. An export alone does not establish a native anchor; the separate reviewed availability and anchoring steps are required. These exports contain ordinary-poll votes and a manifest, not account keys, social-login pairings or original document files. A download is not an independently verified backup or permission to delete source rows.",
        "When an independent encrypted backup store is configured, Resources offers Create and verify encrypted backup for the exact displayed manifest. The host writes only ciphertext, verifies its restored records, and saves the encrypted-file commitment. Retries preserve the original file. A separate folder on the same disk is not an independent failure domain; the operator must qualify the storage and keep its backup encryption key offline. This copy does not include member decryption keys, social pairings or original document files. Verified primary-provider downloads can fall back to the matching saved backup. A receipt does not authorize pruning or guarantee perpetual availability.",
        "Resources offers a separate signed archive approval after independent backup verification. The verifier cannot approve for the administrator. Approval binds the exact manifest, descriptor, backup and retention delay; a changed verifier or availability older than 15 minutes requires a fresh matching attestation. Revoke approval works without access to the backup store. The bounded on-chain anchor covers one supported ordinary-poll or document-version family and preserves transaction receipts and preallocated completion cursors. Approving does not delete data; full supported-release migration/recovery and live provider qualification still gate release. Native pruning checks actual packed proofs, fresh availability, the current administrator and source pins, terminal retention, revocation and exact cursors; ballots/tallies and permanent vote IDs remain."
      ]
    },
    {
      "id": "activity",
      "title": "Connected app activity",
      "paragraphs": [
        "The Activity module records activity from approved connected community apps. Its configured policy requires an independent reviewer for approval.",
        "App registration, member consent and module authorization remain separate. Connecting an app does not grant it treasury, membership or governance authority."
      ]
    },
    {
      "id": "telos-network-ballots",
      "title": "Telos DAO ballots and elections",
      "paragraphs": [
        "Telos DAO has separate Ballots, Elections and Block Producers views on the configured Telos Zero network. Browsing requires no account. Ballots and election history come from telos.decide and the standard 4,VOTE treasury. Foundation elections identify publisher tf and include leaderboard records. History covers retained contract records, not deleted ballots or cleaned receipts. An ended voting period whose status is still voting is awaiting closure.",
        "Foundation and all network elections can be viewed separately. Each record shows its publisher, candidates or options, recorded totals, period and selection limits. Public VOTE ballots are not automatically endorsed by Telos. Unknown candidate labels remain contract option names. Filters and search apply to loaded records; load more appends records. A filtered request scans at most four table pages; the browser continues through at most eight empty batches before offering further loading. HTTPS content references open separately; metadata remains inert text.",
        "Vote with Telos Zero uses Anchor and a supported direct-key active permission. Continuing creates or opens a Daclify account paired with the freshly authenticated native wallet. A cancelled vote can leave that service account in place. If you already use another sign-in method, pair this wallet in Account first to retain one account. Existing paired accounts and vault keys are preserved.",
        "The app reads the contract voter balance selected by the ballot, staked when votestake is enabled and liquid otherwise. Standard VOTE stake reflects the external TLOS stake and REX balance recorded by Decide. Existing registered voters may need to refresh that balance in the Telos app after staking changes. Daclify does not calculate a new token weight. A first registration and cast are atomic native actions. Supported methods are 1token1vote, 1tokennvote and 1acct1vote; light ballots and other methods remain read-only.",
        "External votes use your native account authority. They do not spend Daclify credits, create a Daclify DAO membership or grant permission in another DAO. Explore other DAOs after voting; Account and key setup provides the existing encrypted-vault path needed for new Daclify memberships and private documents.",
        "Voting is enabled only when operator-approved Decide code and ABI pins match the configured chain. The wallet checks the exact transaction and fresh ballot state before broadcast. Keep a pending transaction reference if confirmation or the broadcast response is uncertain. The page checks irreversibility without resubmitting. Pending references persist in this tab; a provider without transaction-status support needs an external chain check. Actual mainnet voting still requires live-wallet qualification by the operator.",
        "Block producer standings come from eosio using get_producers and the chain’s active producer schedule. A registered producer is not necessarily in the active schedule. Vote weights are contract weighted votes rather than direct TLOS balances. Producer voting and Foundation leaderboard voting are read-only in Daclify pending separate signing qualification; the Telos app remains available. This view does not provide historic producer schedules."
      ]
    },
    {
      "id": "governing-documents",
      "title": "Constitutions and legal documents",
      "paragraphs": [
        "In Documents, an administrator registers an existing document as Constitution, Policy, Agreement, Legal document or Other. Choose administrator approval or a member vote, and optionally track member acceptance. These choices remain fixed for that registration. Each DAO can register one Constitution and up to 64 managed documents.",
        "Publishing a version creates content, not adoption. Propose an exact version, review it and adopt it through the chosen approval rule. A vote uses the DAO’s configured quorum, threshold and duration. Finalize after voting closes, then adopt the passed version. Uploading another revision never replaces a pending or adopted version.",
        "Each proposal pins its version, content commitment, adoption revision and contract code hash. A voting proposal also pins the governance policy revision. Adoption is once-only; changed policy or code requires a new proposal. Proposals expire seven days after the vote closes, or seven days after administrator submission. Cancel an open proposal or clear a rejected/expired proposal; finalizing its ballot remains necessary to release its governance lock.",
        "Open the adopted content before confirming that you have reviewed and accept that version. Signing creates one acceptance record for your existing DAO member ID. Later amendments need a new acknowledgement; old records remain. Tracking acceptance does not change membership or voting rights and does not certify legal enforceability or external signatures.",
        "Existing encryption and historic-access rules apply. Private bodies and filenames stay encrypted; document IDs, categories, proposal/vote outcomes and acceptance records are public chain metadata. If an old epoch is unavailable, ask an authorized key holder for permitted access or restore the protected version; do not acknowledge unread content.",
        "Formal management requires the matching upgraded core and Decide binaries, installed action permissions, document-reference coverage and RAM migration. Unsupported deployments keep ordinary Documents available. Proposed/adopted versions and their bound ballots remain protected from ordinary archive pruning; rejected or expired proposal references can be released in batches of at most 25.",
        "Documents → Create from template prepares twelve editable legal drafts. Publish first, then use Continue document setup to select fixed approval and acceptance settings. Only an active administrator with compatible enabled Decide actions can register or propose; being an executive alone does not bypass the native role requirements. Publishing is available independently of registration.",
        "The chooser reads the complete bounded register before assigning a constitution identity. An existing constitution is amended under its original document ID and immutable registration settings; review its exact adopted text first. Other amendments require an explicit document choice. A registration supports at most 64 managed identities. Partial discovery, a changed policy or unavailable exact bytes blocks duplicate-sensitive continuation.",
        "Registration, proposing a version, administrator approval or member voting/finalization/adoption, and each member acceptance remain separate actions. New uploads never replace the adopted version or old acceptance history. Accepting records one member acknowledgement of the exact adopted version; it does not collect outside signatures or establish universal legal validity. Known wording differences from current DAO rules need explicit acknowledgement and separate governance changes.",
        "If publication completed but a later stage failed, keep the published document identity and use Continue document setup or the register to resume. Read current native state before resending an uncertain registration or proposal. Key recovery does not duplicate an acceptance for the same stable native member. Reading a private agreement still requires permitted historical epoch coverage; see Contact recovery."
      ]
    }
  ],
  "schemaVersion": 1,
  "contracts": [
    {
      "name": "activity",
      "abiVersion": "eosio::abi/1.2",
      "sourceAbiHash": "f1a449c47cecebdd78c4df51df81b6b6d0aedf1ce2251289c33614773f41911a",
      "actions": [
        {
          "name": "askreview",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "app_id",
              "type": "uint64"
            },
            {
              "name": "source_id",
              "type": "checksum256"
            },
            {
              "name": "source_revision",
              "type": "checksum256"
            },
            {
              "name": "event_id",
              "type": "checksum256"
            },
            {
              "name": "evidence_cid",
              "type": "string"
            },
            {
              "name": "evidence_hash",
              "type": "checksum256"
            },
            {
              "name": "key_epoch",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "bindrampool",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "checkmig",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "kind",
              "type": "uint8"
            }
          ]
        },
        {
          "name": "checkquota",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "clearclose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "grantappkey",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "app_id",
              "type": "uint64"
            },
            {
              "name": "key_epoch",
              "type": "uint64"
            },
            {
              "name": "recipient",
              "type": "uint64"
            },
            {
              "name": "encryption_key",
              "type": "string"
            },
            {
              "name": "envelope",
              "type": "string"
            }
          ]
        },
        {
          "name": "linkdecision",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "app_id",
              "type": "uint64"
            },
            {
              "name": "receipt_id",
              "type": "uint64"
            },
            {
              "name": "decide",
              "type": "name"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "newappkey",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "app_id",
              "type": "uint64"
            },
            {
              "name": "key_epoch",
              "type": "uint64"
            },
            {
              "name": "security_epoch",
              "type": "uint64"
            },
            {
              "name": "app_revision",
              "type": "uint64"
            },
            {
              "name": "key_commitment",
              "type": "checksum256"
            },
            {
              "name": "self_grant",
              "type": "string"
            }
          ]
        },
        {
          "name": "recordact",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "app_id",
              "type": "uint64"
            },
            {
              "name": "source_id",
              "type": "checksum256"
            },
            {
              "name": "source_revision",
              "type": "checksum256"
            },
            {
              "name": "event_id",
              "type": "checksum256"
            },
            {
              "name": "evidence_cid",
              "type": "string"
            },
            {
              "name": "evidence_hash",
              "type": "checksum256"
            },
            {
              "name": "key_epoch",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "reviewact",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "app_id",
              "type": "uint64"
            },
            {
              "name": "receipt_id",
              "type": "uint64"
            },
            {
              "name": "source_revision",
              "type": "checksum256"
            },
            {
              "name": "accepted",
              "type": "bool"
            },
            {
              "name": "evidence_cid",
              "type": "string"
            },
            {
              "name": "evidence_hash",
              "type": "checksum256"
            },
            {
              "name": "key_epoch",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "scanclose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "scanram",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        }
      ],
      "tables": [
        {
          "name": "actdecisions",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "decide",
              "type": "name"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "metadata_hash",
              "type": "checksum256"
            }
          ]
        },
        {
          "name": "activities",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "app_id",
              "type": "uint64"
            },
            {
              "name": "actor",
              "type": "uint64"
            },
            {
              "name": "kind",
              "type": "uint8"
            },
            {
              "name": "source_id",
              "type": "checksum256"
            },
            {
              "name": "source_revision",
              "type": "checksum256"
            },
            {
              "name": "event_id",
              "type": "checksum256"
            },
            {
              "name": "evidence_cid",
              "type": "string"
            },
            {
              "name": "evidence_hash",
              "type": "checksum256"
            },
            {
              "name": "key_epoch",
              "type": "uint64"
            },
            {
              "name": "created_at",
              "type": "uint32"
            },
            {
              "name": "status",
              "type": "uint8"
            }
          ]
        },
        {
          "name": "actreviews",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "reviewer",
              "type": "uint64"
            },
            {
              "name": "accepted",
              "type": "bool"
            },
            {
              "name": "evidence_cid",
              "type": "string"
            },
            {
              "name": "evidence_hash",
              "type": "checksum256"
            },
            {
              "name": "key_epoch",
              "type": "uint64"
            },
            {
              "name": "reviewed_at",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "appcounts",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "app_id",
              "type": "uint64"
            },
            {
              "name": "receipts",
              "type": "uint64"
            },
            {
              "name": "epochs",
              "type": "uint16"
            },
            {
              "name": "current_key_epoch",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "appgrants",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "key_epoch",
              "type": "uint64"
            },
            {
              "name": "recipient",
              "type": "uint64"
            },
            {
              "name": "encryption_key",
              "type": "string"
            },
            {
              "name": "envelope",
              "type": "string"
            }
          ]
        },
        {
          "name": "appkeys",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "app_id",
              "type": "uint64"
            },
            {
              "name": "security_epoch",
              "type": "uint64"
            },
            {
              "name": "app_revision",
              "type": "uint64"
            },
            {
              "name": "max_member",
              "type": "uint64"
            },
            {
              "name": "key_commitment",
              "type": "checksum256"
            },
            {
              "name": "created_at",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "closechecks",
          "fields": [
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "code_hash",
              "type": "checksum256"
            },
            {
              "name": "closing_at",
              "type": "uint32"
            },
            {
              "name": "stage",
              "type": "uint8"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "ramcursors",
          "fields": [
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "advanced",
              "type": "bool"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "ramoverlays",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "row",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "rampayer",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        }
      ]
    },
    {
      "name": "decide",
      "abiVersion": "eosio::abi/1.2",
      "sourceAbiHash": "5ce73db291c57e82891ddc78f68afa7fc6c169058135564ac60e07a45cab3b9b",
      "actions": [
        {
          "name": "ackdoc",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "adoption_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "adoptdoc",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "proposal_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "backfillrefs",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "bindrampool",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "canceldoc",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "proposal_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "checkmig",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "kind",
              "type": "uint8"
            }
          ]
        },
        {
          "name": "checkquota",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "clearclose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "cleardocs",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "proposal_ids",
              "type": "uint64[]"
            }
          ]
        },
        {
          "name": "execarb",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "execute",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "executeaward",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "finalize",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "markpoll",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "newelect",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "election_id",
              "type": "uint64"
            },
            {
              "name": "title",
              "type": "string"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "nomination_close",
              "type": "uint32"
            },
            {
              "name": "term_start",
              "type": "uint32"
            },
            {
              "name": "term_end",
              "type": "uint32"
            },
            {
              "name": "seats",
              "type": "uint8"
            }
          ]
        },
        {
          "name": "nominate",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "election_id",
              "type": "uint64"
            },
            {
              "name": "active",
              "type": "bool"
            }
          ]
        },
        {
          "name": "open",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "kind",
              "type": "uint8"
            },
            {
              "name": "choices",
              "type": "uint8"
            },
            {
              "name": "duration",
              "type": "uint32"
            },
            {
              "name": "quorum",
              "type": "uint16"
            },
            {
              "name": "approval",
              "type": "uint16"
            },
            {
              "name": "metadata",
              "type": "string"
            }
          ]
        },
        {
          "name": "openarb",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "obligation_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "openaward",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "grants",
              "type": "name"
            },
            {
              "name": "round_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "duration",
              "type": "uint32"
            },
            {
              "name": "quorum",
              "type": "uint16"
            },
            {
              "name": "approval",
              "type": "uint16"
            },
            {
              "name": "metadata",
              "type": "string"
            }
          ]
        },
        {
          "name": "openpoll",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "kind",
              "type": "uint8"
            },
            {
              "name": "choices",
              "type": "uint8"
            },
            {
              "name": "duration",
              "type": "uint32"
            },
            {
              "name": "quorum",
              "type": "uint16"
            },
            {
              "name": "approval",
              "type": "uint16"
            },
            {
              "name": "metadata",
              "type": "string"
            }
          ]
        },
        {
          "name": "openwork",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "works",
              "type": "name"
            },
            {
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "duration",
              "type": "uint32"
            },
            {
              "name": "quorum",
              "type": "uint16"
            },
            {
              "name": "approval",
              "type": "uint16"
            },
            {
              "name": "metadata",
              "type": "string"
            }
          ]
        },
        {
          "name": "proposedoc",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "register_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "expected_revision",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "prunevotes",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "archive_id",
              "type": "uint64"
            },
            {
              "name": "chunk_ordinal",
              "type": "uint32"
            },
            {
              "name": "start",
              "type": "uint32"
            },
            {
              "name": "proofs",
              "type": "archive_prune_proof[]"
            }
          ]
        },
        {
          "name": "recall",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "term_id",
              "type": "uint64"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "regdoc",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "category",
              "type": "uint8"
            },
            {
              "name": "approval",
              "type": "uint8"
            },
            {
              "name": "track_acceptance",
              "type": "bool"
            }
          ]
        },
        {
          "name": "releasetgt",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "ballot_ids",
              "type": "uint64[]"
            }
          ]
        },
        {
          "name": "scanclose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "scanram",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "startelect",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "election_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "vote",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "choice",
              "type": "uint8"
            }
          ]
        },
        {
          "name": "votecommit",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "expected",
              "type": "checksum256"
            },
            {
              "name": "choice",
              "type": "uint8"
            }
          ]
        }
      ],
      "tables": [
        {
          "name": "arbplans",
          "fields": [
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "protection",
              "type": "protected_obligation"
            },
            {
              "name": "quantity",
              "type": "asset"
            },
            {
              "name": "due",
              "type": "uint32"
            },
            {
              "name": "voters",
              "type": "arbitration_voter[]"
            },
            {
              "name": "executed",
              "type": "bool"
            },
            {
              "name": "version",
              "type": "uint16"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "scanned",
              "type": "uint32"
            },
            {
              "name": "ready",
              "type": "bool"
            }
          ]
        },
        {
          "name": "ballotdefs",
          "fields": [
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "version",
              "type": "uint16"
            },
            {
              "name": "purpose",
              "type": "uint8"
            },
            {
              "name": "policy_revision",
              "type": "uint64"
            },
            {
              "name": "policy_hash",
              "type": "checksum256"
            },
            {
              "name": "commitment",
              "type": "checksum256"
            }
          ]
        },
        {
          "name": "ballots",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "creator",
              "type": "uint64"
            },
            {
              "name": "kind",
              "type": "uint8"
            },
            {
              "name": "choices",
              "type": "uint8"
            },
            {
              "name": "closes",
              "type": "uint32"
            },
            {
              "name": "quorum",
              "type": "uint16"
            },
            {
              "name": "approval",
              "type": "uint16"
            },
            {
              "name": "denominator",
              "type": "uint64"
            },
            {
              "name": "max_member",
              "type": "uint64"
            },
            {
              "name": "cast",
              "type": "uint64"
            },
            {
              "name": "tallies",
              "type": "uint64[]"
            },
            {
              "name": "status",
              "type": "uint8"
            },
            {
              "name": "winner",
              "type": "int16"
            },
            {
              "name": "metadata",
              "type": "string"
            }
          ]
        },
        {
          "name": "closechecks",
          "fields": [
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "code_hash",
              "type": "checksum256"
            },
            {
              "name": "closing_at",
              "type": "uint32"
            },
            {
              "name": "stage",
              "type": "uint8"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "docaccepts",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "adoption_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "accepted_at",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "docchanges",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "register_id",
              "type": "uint64"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "commitment",
              "type": "checksum256"
            },
            {
              "name": "source_hash",
              "type": "checksum256"
            },
            {
              "name": "expected_revision",
              "type": "uint64"
            },
            {
              "name": "policy_revision",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "proposer",
              "type": "uint64"
            },
            {
              "name": "proposed_at",
              "type": "uint32"
            },
            {
              "name": "deadline",
              "type": "uint32"
            },
            {
              "name": "adopted_at",
              "type": "uint32"
            },
            {
              "name": "adopted_by",
              "type": "uint64"
            },
            {
              "name": "status",
              "type": "uint8"
            }
          ]
        },
        {
          "name": "docregs",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "category",
              "type": "uint8"
            },
            {
              "name": "approval",
              "type": "uint8"
            },
            {
              "name": "track_acceptance",
              "type": "bool"
            },
            {
              "name": "revision",
              "type": "uint64"
            },
            {
              "name": "adopted_id",
              "type": "uint64"
            },
            {
              "name": "pending_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "elections",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "creator",
              "type": "uint64"
            },
            {
              "name": "title",
              "type": "string"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "document_commitment",
              "type": "checksum256"
            },
            {
              "name": "policy_revision",
              "type": "uint64"
            },
            {
              "name": "nomination_close",
              "type": "uint32"
            },
            {
              "name": "term_start",
              "type": "uint32"
            },
            {
              "name": "term_end",
              "type": "uint32"
            },
            {
              "name": "seats",
              "type": "uint8"
            },
            {
              "name": "status",
              "type": "uint8"
            },
            {
              "name": "candidates",
              "type": "uint64[]"
            }
          ]
        },
        {
          "name": "executions",
          "fields": [
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "works",
              "type": "name"
            },
            {
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "commitment",
              "type": "checksum256"
            },
            {
              "name": "works_hash",
              "type": "checksum256"
            },
            {
              "name": "policy_revision",
              "type": "uint64"
            },
            {
              "name": "deadline",
              "type": "uint32"
            },
            {
              "name": "executed",
              "type": "bool"
            }
          ]
        },
        {
          "name": "grantplans",
          "fields": [
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "grants",
              "type": "name"
            },
            {
              "name": "works",
              "type": "name"
            },
            {
              "name": "round_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "application_revision",
              "type": "uint64"
            },
            {
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "commitment",
              "type": "checksum256"
            },
            {
              "name": "grants_hash",
              "type": "checksum256"
            },
            {
              "name": "works_hash",
              "type": "checksum256"
            },
            {
              "name": "policy_revision",
              "type": "uint64"
            },
            {
              "name": "deadline",
              "type": "uint32"
            },
            {
              "name": "executed",
              "type": "bool"
            }
          ]
        },
        {
          "name": "nominations",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "election_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "pollends",
          "fields": [
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "completed_at",
              "type": "uint32"
            },
            {
              "name": "legacy",
              "type": "bool"
            }
          ]
        },
        {
          "name": "ramcursors",
          "fields": [
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "advanced",
              "type": "bool"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "ramoverlays",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "row",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "rampayer",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "termholds",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "padding",
              "type": "bytes"
            }
          ]
        },
        {
          "name": "terms",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "election_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "title",
              "type": "string"
            },
            {
              "name": "starts",
              "type": "uint32"
            },
            {
              "name": "ends",
              "type": "uint32"
            },
            {
              "name": "recalled",
              "type": "bool"
            },
            {
              "name": "recalled_at",
              "type": "uint32"
            },
            {
              "name": "recall_doc",
              "type": "uint64"
            },
            {
              "name": "recall_version",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "voteids",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "high_water",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "votes",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "ballot",
              "type": "uint64"
            },
            {
              "name": "member",
              "type": "uint64"
            },
            {
              "name": "weight",
              "type": "uint64"
            },
            {
              "name": "choice",
              "type": "uint8"
            }
          ]
        },
        {
          "name": "votetargets",
          "fields": [
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "version",
              "type": "uint16"
            },
            {
              "name": "work",
              "type": "work_ballot_target?"
            },
            {
              "name": "grant",
              "type": "grant_ballot_target?"
            },
            {
              "name": "released",
              "type": "bool"
            }
          ]
        }
      ]
    },
    {
      "name": "works",
      "abiVersion": "eosio::abi/1.2",
      "sourceAbiHash": "e1171a3876b32914123c74cbba1a79b4d282d020ab22535c19dfb87eb1a26cf0",
      "actions": [
        {
          "name": "accept",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "project_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "acceptagr",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "project_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "acceptprot",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "expected",
              "type": "checksum256"
            }
          ]
        },
        {
          "name": "backfillrefs",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "bindrampool",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "cancel",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "project_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "checkmig",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "kind",
              "type": "uint8"
            }
          ]
        },
        {
          "name": "checkquota",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "clearclose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "clearprot",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "project_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "govaccept",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "grantwork",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "grants",
              "type": "name"
            },
            {
              "name": "round_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "offeragr",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "term_start",
              "type": "uint32"
            },
            {
              "name": "term_end",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "offerprot",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "decide",
              "type": "name"
            },
            {
              "name": "backup",
              "type": "uint64"
            },
            {
              "name": "representative",
              "type": "uint64"
            },
            {
              "name": "review_seconds",
              "type": "uint32"
            },
            {
              "name": "challenge_seconds",
              "type": "uint32"
            },
            {
              "name": "vote_seconds",
              "type": "uint32"
            },
            {
              "name": "backup_seconds",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "propose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "contributor",
              "type": "uint64"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "payments",
              "type": "asset[]"
            },
            {
              "name": "dues",
              "type": "uint32[]"
            }
          ]
        },
        {
          "name": "review",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "milestone_id",
              "type": "uint64"
            },
            {
              "name": "approve",
              "type": "bool"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "scanclose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "scanram",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "settle",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "milestone_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "submitwork",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "milestone_id",
              "type": "uint64"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            }
          ]
        }
      ],
      "tables": [
        {
          "name": "agreements",
          "fields": [
            {
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "schema_version",
              "type": "uint16"
            },
            {
              "name": "term_start",
              "type": "uint32"
            },
            {
              "name": "term_end",
              "type": "uint32"
            },
            {
              "name": "terms",
              "type": "checksum256"
            },
            {
              "name": "accepted",
              "type": "bool"
            },
            {
              "name": "accepted_at",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "arbterms",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "contributor",
              "type": "uint64"
            },
            {
              "name": "cutoff",
              "type": "uint32"
            },
            {
              "name": "version",
              "type": "uint16"
            },
            {
              "name": "rules",
              "type": "arbitration_rules"
            },
            {
              "name": "base",
              "type": "checksum256"
            },
            {
              "name": "commitment",
              "type": "checksum256"
            },
            {
              "name": "accepted",
              "type": "bool"
            }
          ]
        },
        {
          "name": "closechecks",
          "fields": [
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "code_hash",
              "type": "checksum256"
            },
            {
              "name": "closing_at",
              "type": "uint32"
            },
            {
              "name": "stage",
              "type": "uint8"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "milestones",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "quantity",
              "type": "asset"
            },
            {
              "name": "due",
              "type": "uint32"
            },
            {
              "name": "status",
              "type": "uint8"
            },
            {
              "name": "submission_doc",
              "type": "uint64"
            },
            {
              "name": "submission_version",
              "type": "uint32"
            },
            {
              "name": "review_doc",
              "type": "uint64"
            },
            {
              "name": "review_version",
              "type": "uint32"
            },
            {
              "name": "reviewer",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "projects",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "creator",
              "type": "uint64"
            },
            {
              "name": "contributor",
              "type": "uint64"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "milestones",
              "type": "uint64[]"
            },
            {
              "name": "status",
              "type": "uint8"
            }
          ]
        },
        {
          "name": "ramcursors",
          "fields": [
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "advanced",
              "type": "bool"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "ramoverlays",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "row",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "rampayer",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        }
      ]
    },
    {
      "name": "payroll",
      "abiVersion": "eosio::abi/1.2",
      "sourceAbiHash": "d70ab21057308d4da7007177458c53c46ceaf96bc2d93dec67f4b1b1a421298e",
      "actions": [
        {
          "name": "backfillrefs",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "bindrampool",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "checkmig",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "kind",
              "type": "uint8"
            }
          ]
        },
        {
          "name": "checkquota",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "clearclose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "commit",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "schedule_id",
              "type": "uint64"
            },
            {
              "name": "recipient",
              "type": "uint64"
            },
            {
              "name": "quantity",
              "type": "asset"
            },
            {
              "name": "periods",
              "type": "uint8"
            },
            {
              "name": "interval",
              "type": "uint32"
            },
            {
              "name": "starts",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "commitdoc",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "schedule_id",
              "type": "uint64"
            },
            {
              "name": "recipient",
              "type": "uint64"
            },
            {
              "name": "quantity",
              "type": "asset"
            },
            {
              "name": "periods",
              "type": "uint8"
            },
            {
              "name": "interval",
              "type": "uint32"
            },
            {
              "name": "starts",
              "type": "uint32"
            },
            {
              "name": "label",
              "type": "string"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "expected",
              "type": "checksum256"
            },
            {
              "name": "successor_of",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "commitpriv",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "schedule_id",
              "type": "uint64"
            },
            {
              "name": "recipient",
              "type": "uint64"
            },
            {
              "name": "quantity",
              "type": "asset"
            },
            {
              "name": "periods",
              "type": "uint8"
            },
            {
              "name": "interval",
              "type": "uint32"
            },
            {
              "name": "starts",
              "type": "uint32"
            },
            {
              "name": "label",
              "type": "private_record_reference"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "expected",
              "type": "checksum256"
            },
            {
              "name": "successor_of",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "edit",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "schedule_id",
              "type": "uint64"
            },
            {
              "name": "paused",
              "type": "uint8"
            },
            {
              "name": "label",
              "type": "string"
            }
          ]
        },
        {
          "name": "editpriv",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "schedule_id",
              "type": "uint64"
            },
            {
              "name": "label",
              "type": "private_record_reference"
            }
          ]
        },
        {
          "name": "releaselabel",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "schedule_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "releaseterms",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "schedule_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "scanclose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "scanram",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "settle",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "entry_id",
              "type": "uint64"
            }
          ]
        }
      ],
      "tables": [
        {
          "name": "closechecks",
          "fields": [
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "code_hash",
              "type": "checksum256"
            },
            {
              "name": "closing_at",
              "type": "uint32"
            },
            {
              "name": "stage",
              "type": "uint8"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "controls",
          "fields": [
            {
              "name": "schedule_id",
              "type": "uint64"
            },
            {
              "name": "paused",
              "type": "uint8"
            },
            {
              "name": "last_payout",
              "type": "uint32"
            },
            {
              "name": "label",
              "type": "string"
            },
            {
              "name": "private_label",
              "type": "private_record_reference?$"
            }
          ]
        },
        {
          "name": "entries",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "schedule_id",
              "type": "uint64"
            },
            {
              "name": "due",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "payterms",
          "fields": [
            {
              "name": "schedule_id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "commitment",
              "type": "checksum256"
            },
            {
              "name": "label",
              "type": "string"
            },
            {
              "name": "successor_of",
              "type": "uint64"
            },
            {
              "name": "schema_version",
              "type": "uint16"
            },
            {
              "name": "references_released",
              "type": "bool"
            },
            {
              "name": "private_label",
              "type": "private_record_reference?$"
            }
          ]
        },
        {
          "name": "ramcursors",
          "fields": [
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "advanced",
              "type": "bool"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "ramoverlays",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "row",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "rampayer",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "schedules",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "creator",
              "type": "uint64"
            },
            {
              "name": "recipient",
              "type": "uint64"
            },
            {
              "name": "quantity",
              "type": "asset"
            },
            {
              "name": "periods",
              "type": "uint8"
            },
            {
              "name": "interval",
              "type": "uint32"
            },
            {
              "name": "starts",
              "type": "uint32"
            },
            {
              "name": "entries",
              "type": "uint64[]"
            }
          ]
        }
      ]
    },
    {
      "name": "grants",
      "abiVersion": "eosio::abi/1.2",
      "sourceAbiHash": "692414352d30640d57e0fcf3bbaf7b6f7117c3d8f25e7a433155f7bbcee309a2",
      "actions": [
        {
          "name": "amend",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "payments",
              "type": "asset[]"
            },
            {
              "name": "dues",
              "type": "uint32[]"
            },
            {
              "name": "term_start",
              "type": "uint32"
            },
            {
              "name": "term_end",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "applygrant",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "round_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "payments",
              "type": "asset[]"
            },
            {
              "name": "dues",
              "type": "uint32[]"
            },
            {
              "name": "term_start",
              "type": "uint32"
            },
            {
              "name": "term_end",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "backfillrefs",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "bindrampool",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "checkmig",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "kind",
              "type": "uint8"
            }
          ]
        },
        {
          "name": "checkquota",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "clearclose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "clearprot",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "closeapp",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "closeround",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "round_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "govaward",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "round_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "newround",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "round_id",
              "type": "uint64"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "applications_close",
              "type": "uint32"
            },
            {
              "name": "review_close",
              "type": "uint32"
            },
            {
              "name": "awards_close",
              "type": "uint32"
            },
            {
              "name": "maximum",
              "type": "asset"
            },
            {
              "name": "allow_agents",
              "type": "bool"
            },
            {
              "name": "works",
              "type": "name"
            }
          ]
        },
        {
          "name": "offerprot",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "decide",
              "type": "name"
            },
            {
              "name": "backup",
              "type": "uint64"
            },
            {
              "name": "representative",
              "type": "uint64"
            },
            {
              "name": "review_seconds",
              "type": "uint32"
            },
            {
              "name": "challenge_seconds",
              "type": "uint32"
            },
            {
              "name": "vote_seconds",
              "type": "uint32"
            },
            {
              "name": "backup_seconds",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "reviewapp",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "eligible",
              "type": "bool"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "scanclose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "scanram",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "submitapp",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "submitprot",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "expected",
              "type": "checksum256"
            }
          ]
        }
      ],
      "tables": [
        {
          "name": "applications",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "round_id",
              "type": "uint64"
            },
            {
              "name": "contributor",
              "type": "uint64"
            },
            {
              "name": "revision",
              "type": "uint64"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "payments",
              "type": "asset[]"
            },
            {
              "name": "dues",
              "type": "uint32[]"
            },
            {
              "name": "term_start",
              "type": "uint32"
            },
            {
              "name": "term_end",
              "type": "uint32"
            },
            {
              "name": "status",
              "type": "uint8"
            },
            {
              "name": "consent_at",
              "type": "uint32"
            },
            {
              "name": "decision_doc",
              "type": "uint64"
            },
            {
              "name": "decision_version",
              "type": "uint32"
            },
            {
              "name": "project_id",
              "type": "uint64"
            },
            {
              "name": "funding_ballot",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "arbterms",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "contributor",
              "type": "uint64"
            },
            {
              "name": "cutoff",
              "type": "uint32"
            },
            {
              "name": "version",
              "type": "uint16"
            },
            {
              "name": "rules",
              "type": "arbitration_rules"
            },
            {
              "name": "base",
              "type": "checksum256"
            },
            {
              "name": "commitment",
              "type": "checksum256"
            },
            {
              "name": "accepted",
              "type": "bool"
            }
          ]
        },
        {
          "name": "closechecks",
          "fields": [
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "code_hash",
              "type": "checksum256"
            },
            {
              "name": "closing_at",
              "type": "uint32"
            },
            {
              "name": "stage",
              "type": "uint8"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "ramcursors",
          "fields": [
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "advanced",
              "type": "bool"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "ramoverlays",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "row",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "rampayer",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "rounds",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "creator",
              "type": "uint64"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "rules_revision",
              "type": "uint64"
            },
            {
              "name": "applications_close",
              "type": "uint32"
            },
            {
              "name": "review_close",
              "type": "uint32"
            },
            {
              "name": "awards_close",
              "type": "uint32"
            },
            {
              "name": "maximum",
              "type": "asset"
            },
            {
              "name": "awarded",
              "type": "int64"
            },
            {
              "name": "allow_agents",
              "type": "bool"
            },
            {
              "name": "works",
              "type": "name"
            },
            {
              "name": "closed",
              "type": "bool"
            }
          ]
        }
      ]
    },
    {
      "name": "endorse",
      "abiVersion": "eosio::abi/1.2",
      "sourceAbiHash": "3a143af1dffbc2e5a8d2b11cb232a0f878a52da3879dc4c1ada81d3ca30a9f91",
      "actions": [
        {
          "name": "admit",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "revision",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "applyjoin",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "signing_key",
              "type": "public_key"
            },
            {
              "name": "encryption_key",
              "type": "string"
            },
            {
              "name": "custody",
              "type": "uint8"
            },
            {
              "name": "kind",
              "type": "uint8"
            },
            {
              "name": "operator_label",
              "type": "string"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "expires",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "backfillrefs",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "bindrampool",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "checkmig",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "kind",
              "type": "uint8"
            }
          ]
        },
        {
          "name": "checkquota",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "clearclose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "scanclose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "scanram",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "unwitness",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "revision",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "witness",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "application_id",
              "type": "uint64"
            },
            {
              "name": "revision",
              "type": "uint64"
            }
          ]
        }
      ],
      "tables": [
        {
          "name": "closechecks",
          "fields": [
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "code_hash",
              "type": "checksum256"
            },
            {
              "name": "closing_at",
              "type": "uint32"
            },
            {
              "name": "stage",
              "type": "uint8"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "joinapps",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "sponsor",
              "type": "uint64"
            },
            {
              "name": "revision",
              "type": "uint64"
            },
            {
              "name": "policy_revision",
              "type": "uint64"
            },
            {
              "name": "signing_key",
              "type": "public_key"
            },
            {
              "name": "encryption_key",
              "type": "string"
            },
            {
              "name": "custody",
              "type": "uint8"
            },
            {
              "name": "kind",
              "type": "uint8"
            },
            {
              "name": "operator_label",
              "type": "string"
            },
            {
              "name": "document_id",
              "type": "uint64"
            },
            {
              "name": "document_version",
              "type": "uint32"
            },
            {
              "name": "document_commitment",
              "type": "checksum256"
            },
            {
              "name": "expires",
              "type": "uint32"
            },
            {
              "name": "witnesses",
              "type": "uint64[]"
            },
            {
              "name": "admitted",
              "type": "bool"
            },
            {
              "name": "member_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "ramcursors",
          "fields": [
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "advanced",
              "type": "bool"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "ramoverlays",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "row",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "rampayer",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        }
      ]
    },
    {
      "name": "quickvote",
      "abiVersion": "eosio::abi/1.2",
      "sourceAbiHash": "47d728ba05fc1c03f7a6acca2063e4c0bc41a41fc382ac57c853d82f1e34edb1",
      "actions": [
        {
          "name": "backfillrefs",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "bindrampool",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        },
        {
          "name": "checkmig",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "kind",
              "type": "uint8"
            }
          ]
        },
        {
          "name": "checkquota",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "clearclosed",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "close",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "finalize",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "up",
              "type": "uint32"
            },
            {
              "name": "proof",
              "type": "bytes"
            }
          ]
        },
        {
          "name": "init",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "authority",
              "type": "name"
            },
            {
              "name": "authority_hash",
              "type": "checksum256"
            }
          ]
        },
        {
          "name": "open",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "member_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "definition",
              "type": "quick_definition"
            },
            {
              "name": "key",
              "type": "bytes"
            },
            {
              "name": "possession",
              "type": "bytes"
            },
            {
              "name": "grants",
              "type": "bytes[]"
            }
          ]
        },
        {
          "name": "prepare",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "prune",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "archive_id",
              "type": "uint64"
            },
            {
              "name": "chunk_ordinal",
              "type": "uint32"
            },
            {
              "name": "start",
              "type": "uint32"
            },
            {
              "name": "proofs",
              "type": "archive_prune_proof[]"
            }
          ]
        },
        {
          "name": "prunegrants",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "archive_id",
              "type": "uint64"
            },
            {
              "name": "siblings",
              "type": "checksum256[]"
            }
          ]
        },
        {
          "name": "remove",
          "fields": [
            {
              "name": "actor",
              "type": "quick_actor_context"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "expected_revision",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "respond",
          "fields": [
            {
              "name": "actor",
              "type": "quick_actor_context"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "expected_revision",
              "type": "uint64"
            },
            {
              "name": "ciphertext",
              "type": "bytes"
            },
            {
              "name": "proof",
              "type": "bytes"
            },
            {
              "name": "receipt",
              "type": "bytes"
            }
          ]
        },
        {
          "name": "scanclose",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "scanram",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "limit",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "tick",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            }
          ]
        }
      ],
      "tables": [
        {
          "name": "closechecks",
          "fields": [
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "code_hash",
              "type": "checksum256"
            },
            {
              "name": "closing_at",
              "type": "uint32"
            },
            {
              "name": "stage",
              "type": "uint8"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "qballots",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "creator_id",
              "type": "uint64"
            },
            {
              "name": "opened_at",
              "type": "uint32"
            },
            {
              "name": "definition",
              "type": "quick_definition"
            },
            {
              "name": "definition_hash",
              "type": "checksum256"
            },
            {
              "name": "key",
              "type": "bytes"
            },
            {
              "name": "key_proof",
              "type": "bytes"
            },
            {
              "name": "aggregate",
              "type": "bytes"
            },
            {
              "name": "count",
              "type": "uint32"
            },
            {
              "name": "identities",
              "type": "uint32"
            },
            {
              "name": "closed_at",
              "type": "uint32"
            },
            {
              "name": "scan_cursor",
              "type": "uint64"
            },
            {
              "name": "scan_rows",
              "type": "uint32"
            },
            {
              "name": "scan_count",
              "type": "uint32"
            },
            {
              "name": "scan_aggregate",
              "type": "bytes"
            },
            {
              "name": "response_root",
              "type": "checksum256"
            },
            {
              "name": "prepared",
              "type": "bool"
            },
            {
              "name": "up",
              "type": "uint32"
            },
            {
              "name": "final_proof",
              "type": "bytes"
            },
            {
              "name": "verified",
              "type": "bool"
            },
            {
              "name": "pruned",
              "type": "bool"
            }
          ]
        },
        {
          "name": "qclock",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "authority",
              "type": "name"
            },
            {
              "name": "authority_hash",
              "type": "checksum256"
            },
            {
              "name": "next_response_id",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "qgrants",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "grants",
              "type": "bytes[]"
            }
          ]
        },
        {
          "name": "qresponses",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "dao_id",
              "type": "uint64"
            },
            {
              "name": "ballot_id",
              "type": "uint64"
            },
            {
              "name": "identity",
              "type": "checksum256"
            },
            {
              "name": "revision",
              "type": "uint64"
            },
            {
              "name": "active",
              "type": "bool"
            },
            {
              "name": "ciphertext",
              "type": "bytes"
            },
            {
              "name": "proof",
              "type": "bytes"
            },
            {
              "name": "receipt",
              "type": "bytes"
            },
            {
              "name": "updated_at",
              "type": "uint32"
            }
          ]
        },
        {
          "name": "ramcursors",
          "fields": [
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "cursor",
              "type": "uint64"
            },
            {
              "name": "advanced",
              "type": "bool"
            },
            {
              "name": "complete",
              "type": "bool"
            }
          ]
        },
        {
          "name": "ramoverlays",
          "fields": [
            {
              "name": "id",
              "type": "uint64"
            },
            {
              "name": "table",
              "type": "name"
            },
            {
              "name": "row",
              "type": "uint64"
            }
          ]
        },
        {
          "name": "rampayer",
          "fields": [
            {
              "name": "runtime",
              "type": "name"
            }
          ]
        }
      ]
    }
  ],
  "api": [
    {
      "method": "GET",
      "path": "/v1/daos/:id/private-payroll/:schedule",
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "source": {
            "type": "string",
            "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
          },
          "scheduleId": {
            "type": "string",
            "maxLength": 20
          },
          "agreed": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "documentId": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "version": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 4294967295
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "keyEpoch": {
                    "type": "string",
                    "maxLength": 20
                  }
                },
                "required": [
                  "documentId",
                  "version",
                  "commitment",
                  "keyEpoch"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "display": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "documentId": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "version": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 4294967295
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "keyEpoch": {
                    "type": "string",
                    "maxLength": 20
                  }
                },
                "required": [
                  "documentId",
                  "version",
                  "commitment",
                  "keyEpoch"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "dao",
          "source",
          "scheduleId",
          "agreed",
          "display"
        ],
        "additionalProperties": false
      },
      "helpTopic": "payroll"
    },
    {
      "method": "GET",
      "path": "/v1/quick-ballots/definitions",
      "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "after": {
            "type": "string",
            "maxLength": 20
          },
          "daoId": {
            "type": "string",
            "maxLength": 20
          }
        },
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "available": {
            "type": "boolean"
          },
          "experimental": {
            "type": "boolean",
            "const": true
          },
          "domain": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "chainId": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "runtime": {
                    "type": "string",
                    "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                  },
                  "source": {
                    "type": "string",
                    "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                  }
                },
                "required": [
                  "chainId",
                  "runtime",
                  "source"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "ballots": {
            "maxItems": 25,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "creator_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "opened_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "definition": {
                  "type": "object",
                  "properties": {
                    "protocol": {
                      "anyOf": [
                        {
                          "type": "number",
                          "const": 1
                        },
                        {
                          "type": "number",
                          "const": 2
                        },
                        {
                          "type": "number",
                          "const": 3
                        }
                      ]
                    },
                    "question": {
                      "type": "string",
                      "maxLength": 256
                    },
                    "explanation": {
                      "type": "string",
                      "maxLength": 4096
                    },
                    "all_accounts": {
                      "type": "boolean"
                    },
                    "audience": {
                      "maxItems": 20,
                      "type": "array",
                      "items": {
                        "type": "string",
                        "maxLength": 20
                      }
                    },
                    "closes": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "readers": {
                      "minItems": 1,
                      "maxItems": 8,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "member_id": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "encryption_key": {
                            "type": "string",
                            "maxLength": 256
                          }
                        },
                        "required": [
                          "member_id",
                          "encryption_key"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "protocol",
                    "question",
                    "explanation",
                    "all_accounts",
                    "audience",
                    "closes",
                    "readers"
                  ],
                  "additionalProperties": false
                },
                "definition_hash": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "key": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{192}$"
                },
                "key_proof": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{128}$"
                },
                "aggregate": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{384}$"
                },
                "count": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 5000
                },
                "identities": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 5000
                },
                "closed_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "scan_cursor": {
                  "type": "string",
                  "maxLength": 20
                },
                "scan_rows": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "scan_count": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "scan_aggregate": {
                  "type": "string",
                  "maxLength": 32768,
                  "pattern": "^(?:[0-9a-f]{2})*$"
                },
                "response_root": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "prepared": {
                  "type": "boolean"
                },
                "up": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "final_proof": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{128}$"
                },
                "verified": {
                  "type": "boolean"
                },
                "pruned": {
                  "type": "boolean"
                }
              },
              "required": [
                "id",
                "dao_id",
                "creator_id",
                "opened_at",
                "definition",
                "definition_hash",
                "key",
                "key_proof",
                "aggregate",
                "count",
                "identities",
                "closed_at",
                "scan_cursor",
                "scan_rows",
                "scan_count",
                "scan_aggregate",
                "response_root",
                "prepared",
                "up",
                "final_proof",
                "verified",
                "pruned"
              ],
              "additionalProperties": false
            }
          },
          "next": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "available",
          "experimental",
          "domain",
          "ballots",
          "next"
        ],
        "additionalProperties": false
      },
      "helpTopic": "quick-ballots"
    },
    {
      "method": "GET",
      "path": "/v1/quick-ballots/:ballotId/definition",
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "chainId": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "runtime": {
            "type": "string",
            "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
          },
          "source": {
            "type": "string",
            "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
          },
          "ballot": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "maxLength": 20
              },
              "dao_id": {
                "type": "string",
                "maxLength": 20
              },
              "creator_id": {
                "type": "string",
                "maxLength": 20
              },
              "opened_at": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "definition": {
                "type": "object",
                "properties": {
                  "protocol": {
                    "anyOf": [
                      {
                        "type": "number",
                        "const": 1
                      },
                      {
                        "type": "number",
                        "const": 2
                      },
                      {
                        "type": "number",
                        "const": 3
                      }
                    ]
                  },
                  "question": {
                    "type": "string",
                    "maxLength": 256
                  },
                  "explanation": {
                    "type": "string",
                    "maxLength": 4096
                  },
                  "all_accounts": {
                    "type": "boolean"
                  },
                  "audience": {
                    "maxItems": 20,
                    "type": "array",
                    "items": {
                      "type": "string",
                      "maxLength": 20
                    }
                  },
                  "closes": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "readers": {
                    "minItems": 1,
                    "maxItems": 8,
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "member_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "encryption_key": {
                          "type": "string",
                          "maxLength": 256
                        }
                      },
                      "required": [
                        "member_id",
                        "encryption_key"
                      ],
                      "additionalProperties": false
                    }
                  }
                },
                "required": [
                  "protocol",
                  "question",
                  "explanation",
                  "all_accounts",
                  "audience",
                  "closes",
                  "readers"
                ],
                "additionalProperties": false
              },
              "definition_hash": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "key": {
                "type": "string",
                "pattern": "^[0-9a-f]{192}$"
              },
              "key_proof": {
                "type": "string",
                "pattern": "^[0-9a-f]{128}$"
              },
              "aggregate": {
                "type": "string",
                "pattern": "^[0-9a-f]{384}$"
              },
              "count": {
                "type": "integer",
                "minimum": 0,
                "maximum": 5000
              },
              "identities": {
                "type": "integer",
                "minimum": 0,
                "maximum": 5000
              },
              "closed_at": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "scan_cursor": {
                "type": "string",
                "maxLength": 20
              },
              "scan_rows": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "scan_count": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "scan_aggregate": {
                "type": "string",
                "maxLength": 32768,
                "pattern": "^(?:[0-9a-f]{2})*$"
              },
              "response_root": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "prepared": {
                "type": "boolean"
              },
              "up": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "final_proof": {
                "type": "string",
                "pattern": "^[0-9a-f]{128}$"
              },
              "verified": {
                "type": "boolean"
              },
              "pruned": {
                "type": "boolean"
              }
            },
            "required": [
              "id",
              "dao_id",
              "creator_id",
              "opened_at",
              "definition",
              "definition_hash",
              "key",
              "key_proof",
              "aggregate",
              "count",
              "identities",
              "closed_at",
              "scan_cursor",
              "scan_rows",
              "scan_count",
              "scan_aggregate",
              "response_root",
              "prepared",
              "up",
              "final_proof",
              "verified",
              "pruned"
            ],
            "additionalProperties": false
          },
          "grants": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "dao_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "grants": {
                    "maxItems": 5000,
                    "type": "array",
                    "items": {
                      "type": "string",
                      "maxLength": 32768,
                      "pattern": "^(?:[0-9a-f]{2})*$"
                    }
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "grants"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "chainId",
          "runtime",
          "source",
          "ballot",
          "grants"
        ],
        "additionalProperties": false
      },
      "helpTopic": "quick-ballots"
    },
    {
      "method": "GET",
      "path": "/v1/quick-ballots/:ballotId/responses",
      "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "after": {
            "type": "string",
            "maxLength": 20
          }
        },
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "responses": {
            "maxItems": 25,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "ballot_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "identity": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "active": {
                  "type": "boolean"
                },
                "ciphertext": {
                  "type": "string",
                  "maxLength": 32768,
                  "pattern": "^(?:[0-9a-f]{2})*$"
                },
                "proof": {
                  "type": "string",
                  "maxLength": 32768,
                  "pattern": "^(?:[0-9a-f]{2})*$"
                },
                "receipt": {
                  "type": "string",
                  "maxLength": 32768,
                  "pattern": "^(?:[0-9a-f]{2})*$"
                },
                "updated_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                }
              },
              "required": [
                "id",
                "dao_id",
                "ballot_id",
                "identity",
                "revision",
                "active",
                "ciphertext",
                "proof",
                "receipt",
                "updated_at"
              ],
              "additionalProperties": false
            }
          },
          "next": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "null"
              }
            ]
          },
          "pruned": {
            "type": "boolean"
          },
          "root": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          }
        },
        "required": [
          "responses",
          "next",
          "pruned",
          "root"
        ],
        "additionalProperties": false
      },
      "helpTopic": "quick-ballots"
    },
    {
      "method": "GET",
      "path": "/v1/quick-ballots/:ballotId/archive",
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "archives": {
            "maxItems": 2,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "anchor": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "dao_id": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "manifest": {
                      "type": "object",
                      "properties": {
                        "format_version": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 65535
                        },
                        "chain_id": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "runtime": {
                          "type": "string",
                          "maxLength": 13
                        },
                        "dao_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "source": {
                          "type": "string",
                          "maxLength": 13
                        },
                        "code_hash": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "abi_hash": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "block_number": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "block_id": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "timestamp": {
                          "type": "string",
                          "maxLength": 16384
                        },
                        "families": {
                          "maxItems": 5000,
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "kind": {
                                "type": "string",
                                "maxLength": 16384
                              },
                              "parent_id": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "table": {
                                "type": "string",
                                "maxLength": 13
                              },
                              "scope": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "schema_hash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "records": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "chunks": {
                                "maxItems": 5000,
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "domain": {
                                      "type": "object",
                                      "properties": {
                                        "format_version": {
                                          "type": "integer",
                                          "minimum": 0,
                                          "maximum": 65535
                                        },
                                        "chain_id": {
                                          "type": "string",
                                          "pattern": "^[0-9a-f]{64}$"
                                        },
                                        "runtime": {
                                          "type": "string",
                                          "maxLength": 13
                                        },
                                        "dao_id": {
                                          "type": "string",
                                          "maxLength": 20
                                        },
                                        "source": {
                                          "type": "string",
                                          "maxLength": 13
                                        },
                                        "code_hash": {
                                          "type": "string",
                                          "pattern": "^[0-9a-f]{64}$"
                                        },
                                        "abi_hash": {
                                          "type": "string",
                                          "pattern": "^[0-9a-f]{64}$"
                                        },
                                        "schema_hash": {
                                          "type": "string",
                                          "pattern": "^[0-9a-f]{64}$"
                                        },
                                        "table": {
                                          "type": "string",
                                          "maxLength": 13
                                        },
                                        "scope": {
                                          "type": "string",
                                          "maxLength": 20
                                        },
                                        "chunk_ordinal": {
                                          "type": "integer",
                                          "minimum": 0,
                                          "maximum": 4294967295
                                        },
                                        "leaf_count": {
                                          "type": "integer",
                                          "minimum": 0,
                                          "maximum": 4294967295
                                        }
                                      },
                                      "required": [
                                        "format_version",
                                        "chain_id",
                                        "runtime",
                                        "dao_id",
                                        "source",
                                        "code_hash",
                                        "abi_hash",
                                        "schema_hash",
                                        "table",
                                        "scope",
                                        "chunk_ordinal",
                                        "leaf_count"
                                      ],
                                      "additionalProperties": false
                                    },
                                    "root": {
                                      "type": "string",
                                      "pattern": "^[0-9a-f]{64}$"
                                    },
                                    "cid": {
                                      "type": "string",
                                      "maxLength": 16384
                                    },
                                    "bytes": {
                                      "type": "integer",
                                      "minimum": 0,
                                      "maximum": 4294967295
                                    },
                                    "commitment": {
                                      "type": "string",
                                      "pattern": "^[0-9a-f]{64}$"
                                    },
                                    "first_key": {
                                      "type": "string",
                                      "maxLength": 20
                                    },
                                    "last_key": {
                                      "type": "string",
                                      "maxLength": 20
                                    }
                                  },
                                  "required": [
                                    "domain",
                                    "root",
                                    "cid",
                                    "bytes",
                                    "commitment",
                                    "first_key",
                                    "last_key"
                                  ],
                                  "additionalProperties": false
                                }
                              }
                            },
                            "required": [
                              "kind",
                              "parent_id",
                              "table",
                              "scope",
                              "schema_hash",
                              "records",
                              "chunks"
                            ],
                            "additionalProperties": false
                          }
                        },
                        "files": {
                          "maxItems": 5000,
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "document_id": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "version": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 4294967295
                              },
                              "cid": {
                                "type": "string",
                                "maxLength": 16384
                              },
                              "bytes": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "commitment": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "envelope_version": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 255
                              },
                              "key_epoch": {
                                "type": "string",
                                "maxLength": 20
                              }
                            },
                            "required": [
                              "document_id",
                              "version",
                              "cid",
                              "bytes",
                              "commitment",
                              "envelope_version",
                              "key_epoch"
                            ],
                            "additionalProperties": false
                          }
                        }
                      },
                      "required": [
                        "format_version",
                        "chain_id",
                        "runtime",
                        "dao_id",
                        "source",
                        "code_hash",
                        "abi_hash",
                        "block_number",
                        "block_id",
                        "timestamp",
                        "families",
                        "files"
                      ],
                      "additionalProperties": false
                    },
                    "manifest_cid": {
                      "type": "string",
                      "maxLength": 16384
                    },
                    "manifest_bytes": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "manifest_commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "descriptor_commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "backup_commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "verifier": {
                      "type": "string",
                      "maxLength": 13
                    },
                    "attestation_transaction": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "approval_transaction": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "retention_seconds": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "attested_at": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "approved_by": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "approved_at": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "revoked": {
                      "type": "boolean"
                    }
                  },
                  "required": [
                    "id",
                    "dao_id",
                    "manifest",
                    "manifest_cid",
                    "manifest_bytes",
                    "manifest_commitment",
                    "descriptor_commitment",
                    "backup_commitment",
                    "verifier",
                    "attestation_transaction",
                    "approval_transaction",
                    "retention_seconds",
                    "attested_at",
                    "approved_by",
                    "approved_at",
                    "revoked"
                  ],
                  "additionalProperties": false
                },
                "bundle": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "format": "uuid",
                      "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                    },
                    "manifest": {
                      "type": "object",
                      "properties": {
                        "schemaVersion": {
                          "type": "number",
                          "const": 1
                        },
                        "dao": {
                          "type": "object",
                          "properties": {
                            "chainId": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "contract": {
                              "type": "string",
                              "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                            },
                            "daoId": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "interfaceVersion": {
                              "type": "number",
                              "const": 1
                            }
                          },
                          "required": [
                            "chainId",
                            "contract",
                            "daoId",
                            "interfaceVersion"
                          ],
                          "additionalProperties": false
                        },
                        "snapshot": {
                          "type": "object",
                          "properties": {
                            "blockNumber": {
                              "type": "integer",
                              "minimum": 1,
                              "maximum": 4294967295
                            },
                            "blockId": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "timestamp": {
                              "anyOf": [
                                {
                                  "type": "string",
                                  "format": "date-time",
                                  "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                                },
                                {
                                  "type": "string",
                                  "format": "date-time",
                                  "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                                }
                              ]
                            }
                          },
                          "required": [
                            "blockNumber",
                            "blockId",
                            "timestamp"
                          ],
                          "additionalProperties": false
                        },
                        "source": {
                          "type": "object",
                          "properties": {
                            "account": {
                              "type": "string",
                              "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                            },
                            "codeHash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "abiHash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            }
                          },
                          "required": [
                            "account",
                            "codeHash",
                            "abiHash"
                          ],
                          "additionalProperties": false
                        },
                        "families": {
                          "minItems": 1,
                          "maxItems": 64,
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "kind": {
                                "type": "string",
                                "enum": [
                                  "ordinary-poll-votes",
                                  "document-versions",
                                  "quick-ballot-responses",
                                  "quick-ballot-grants",
                                  "protected-export"
                                ]
                              },
                              "parentId": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "table": {
                                "type": "string",
                                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                              },
                              "scope": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "schemaHash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "records": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "chunks": {
                                "maxItems": 1024,
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "domain": {
                                      "type": "object",
                                      "properties": {
                                        "format_version": {
                                          "type": "number",
                                          "const": 1
                                        },
                                        "chain_id": {
                                          "type": "string",
                                          "pattern": "^[0-9a-f]{64}$"
                                        },
                                        "runtime": {
                                          "type": "string",
                                          "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                                        },
                                        "dao_id": {
                                          "type": "string",
                                          "maxLength": 20
                                        },
                                        "source": {
                                          "type": "string",
                                          "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                                        },
                                        "code_hash": {
                                          "type": "string",
                                          "pattern": "^[0-9a-f]{64}$"
                                        },
                                        "abi_hash": {
                                          "type": "string",
                                          "pattern": "^[0-9a-f]{64}$"
                                        },
                                        "schema_hash": {
                                          "type": "string",
                                          "pattern": "^[0-9a-f]{64}$"
                                        },
                                        "table": {
                                          "type": "string",
                                          "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                                        },
                                        "scope": {
                                          "type": "string",
                                          "maxLength": 20
                                        },
                                        "chunk_ordinal": {
                                          "type": "integer",
                                          "minimum": 0,
                                          "maximum": 4294967295
                                        },
                                        "leaf_count": {
                                          "type": "integer",
                                          "minimum": 1,
                                          "maximum": 65536
                                        }
                                      },
                                      "required": [
                                        "format_version",
                                        "chain_id",
                                        "runtime",
                                        "dao_id",
                                        "source",
                                        "code_hash",
                                        "abi_hash",
                                        "schema_hash",
                                        "table",
                                        "scope",
                                        "chunk_ordinal",
                                        "leaf_count"
                                      ],
                                      "additionalProperties": false
                                    },
                                    "root": {
                                      "type": "string",
                                      "pattern": "^[0-9a-f]{64}$"
                                    },
                                    "cid": {
                                      "type": "string",
                                      "maxLength": 128
                                    },
                                    "bytes": {
                                      "type": "integer",
                                      "minimum": 188,
                                      "maximum": 5242880
                                    },
                                    "commitment": {
                                      "type": "string",
                                      "pattern": "^[0-9a-f]{64}$"
                                    },
                                    "firstKey": {
                                      "type": "string",
                                      "maxLength": 20
                                    },
                                    "lastKey": {
                                      "type": "string",
                                      "maxLength": 20
                                    }
                                  },
                                  "required": [
                                    "domain",
                                    "root",
                                    "cid",
                                    "bytes",
                                    "commitment",
                                    "firstKey",
                                    "lastKey"
                                  ],
                                  "additionalProperties": false
                                }
                              }
                            },
                            "required": [
                              "kind",
                              "parentId",
                              "table",
                              "scope",
                              "schemaHash",
                              "records",
                              "chunks"
                            ],
                            "additionalProperties": false
                          }
                        },
                        "files": {
                          "maxItems": 65536,
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "document_id": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "version": {
                                "type": "integer",
                                "minimum": 1,
                                "maximum": 4294967295
                              },
                              "cid": {
                                "type": "string",
                                "maxLength": 128
                              },
                              "bytes": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "commitment": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "envelope_version": {
                                "anyOf": [
                                  {
                                    "type": "number",
                                    "const": 0
                                  },
                                  {
                                    "type": "number",
                                    "const": 1
                                  }
                                ]
                              },
                              "key_epoch": {
                                "type": "string",
                                "maxLength": 20
                              }
                            },
                            "required": [
                              "document_id",
                              "version",
                              "cid",
                              "bytes",
                              "commitment",
                              "envelope_version",
                              "key_epoch"
                            ],
                            "additionalProperties": false
                          }
                        },
                        "descriptorCommitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        }
                      },
                      "required": [
                        "schemaVersion",
                        "dao",
                        "snapshot",
                        "source",
                        "families",
                        "files",
                        "descriptorCommitment"
                      ],
                      "additionalProperties": false
                    },
                    "manifestFile": {
                      "type": "object",
                      "properties": {
                        "cid": {
                          "type": "string",
                          "maxLength": 128
                        },
                        "bytes": {
                          "type": "integer",
                          "minimum": 1,
                          "maximum": 5242880
                        },
                        "commitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "content": {
                          "type": "string",
                          "minLength": 4,
                          "maxLength": 6990508
                        }
                      },
                      "required": [
                        "cid",
                        "bytes",
                        "commitment",
                        "content"
                      ],
                      "additionalProperties": false
                    },
                    "chunks": {
                      "maxItems": 1024,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "cid": {
                            "type": "string",
                            "maxLength": 128
                          },
                          "content": {
                            "type": "string",
                            "minLength": 4,
                            "maxLength": 6990508
                          }
                        },
                        "required": [
                          "cid",
                          "content"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "id",
                    "manifest",
                    "manifestFile",
                    "chunks"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "anchor",
                "bundle"
              ],
              "additionalProperties": false
            }
          },
          "complete": {
            "type": "boolean"
          }
        },
        "required": [
          "archives",
          "complete"
        ],
        "additionalProperties": false
      },
      "helpTopic": "quick-ballots"
    },
    {
      "method": "GET",
      "path": "/v1/quick-ballots/:ballotId/response",
      "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "identity": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          }
        },
        "required": [
          "identity"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "response": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "dao_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "ballot_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "identity": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "revision": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "active": {
                    "type": "boolean"
                  },
                  "ciphertext": {
                    "type": "string",
                    "maxLength": 32768,
                    "pattern": "^(?:[0-9a-f]{2})*$"
                  },
                  "proof": {
                    "type": "string",
                    "maxLength": 32768,
                    "pattern": "^(?:[0-9a-f]{2})*$"
                  },
                  "receipt": {
                    "type": "string",
                    "maxLength": 32768,
                    "pattern": "^(?:[0-9a-f]{2})*$"
                  },
                  "updated_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "ballot_id",
                  "identity",
                  "revision",
                  "active",
                  "ciphertext",
                  "proof",
                  "receipt",
                  "updated_at"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "response"
        ],
        "additionalProperties": false
      },
      "helpTopic": "quick-ballots"
    },
    {
      "method": "GET",
      "path": "/v1/daos/:id/quick-ballots/readers",
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "readers": {
            "maxItems": 8,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "member_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "encryption_key": {
                  "type": "string",
                  "maxLength": 16384
                }
              },
              "required": [
                "member_id",
                "encryption_key"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "dao",
          "readers"
        ],
        "additionalProperties": false
      },
      "helpTopic": "quick-ballots"
    },
    {
      "method": "POST",
      "path": "/v1/quick-ballots/:ballotId/advance",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {},
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "transactionId": {
            "anyOf": [
              {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              {
                "type": "null"
              }
            ]
          },
          "prepared": {
            "type": "boolean"
          }
        },
        "required": [
          "transactionId",
          "prepared"
        ],
        "additionalProperties": false
      },
      "helpTopic": "quick-ballots"
    },
    {
      "method": "POST",
      "path": "/v1/quick-ballots/:ballotId/finalize",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "expectedDefinitionHash": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "expectedRoot": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "up": {
            "type": "integer",
            "minimum": 0,
            "maximum": 5000
          },
          "proof": {
            "type": "string",
            "pattern": "^[0-9a-f]{128}$"
          }
        },
        "required": [
          "expectedDefinitionHash",
          "expectedRoot",
          "up",
          "proof"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "transactionId": {
            "anyOf": [
              {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              {
                "type": "null"
              }
            ]
          },
          "prepared": {
            "type": "boolean"
          }
        },
        "required": [
          "transactionId",
          "prepared"
        ],
        "additionalProperties": false
      },
      "helpTopic": "quick-ballots"
    },
    {
      "method": "POST",
      "path": "/v1/works/arbitration",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "obligationId": {
            "type": "string",
            "maxLength": 20
          },
          "operation": {
            "type": "string",
            "enum": [
              "advance",
              "open-vote"
            ]
          }
        },
        "required": [
          "dao",
          "obligationId",
          "operation"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "transactionId": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "ballotId": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "null"
              }
            ]
          },
          "state": {
            "type": "integer",
            "minimum": 0,
            "maximum": 8
          }
        },
        "required": [
          "transactionId",
          "ballotId",
          "state"
        ],
        "additionalProperties": false
      },
      "helpTopic": "works"
    },
    {
      "method": "GET",
      "path": "/v1/daos/:id/ballots/:ballotId/export",
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "schemaVersion": {
            "type": "number",
            "const": 1
          },
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "decide": {
            "type": "string",
            "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
          },
          "ballot": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "maxLength": 20
              },
              "dao_id": {
                "type": "string",
                "maxLength": 20
              },
              "creator": {
                "type": "string",
                "maxLength": 20
              },
              "kind": {
                "type": "integer",
                "minimum": 0,
                "maximum": 255
              },
              "choices": {
                "type": "integer",
                "minimum": 0,
                "maximum": 255
              },
              "closes": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "quorum": {
                "type": "integer",
                "minimum": 0,
                "maximum": 65535
              },
              "approval": {
                "type": "integer",
                "minimum": 0,
                "maximum": 65535
              },
              "denominator": {
                "type": "string",
                "maxLength": 20
              },
              "max_member": {
                "type": "string",
                "maxLength": 20
              },
              "cast": {
                "type": "string",
                "maxLength": 20
              },
              "tallies": {
                "maxItems": 5000,
                "type": "array",
                "items": {
                  "type": "string",
                  "maxLength": 20
                }
              },
              "status": {
                "type": "integer",
                "minimum": 0,
                "maximum": 255
              },
              "winner": {
                "type": "integer",
                "minimum": -32768,
                "maximum": 32767
              },
              "metadata": {
                "type": "string",
                "maxLength": 16384
              }
            },
            "required": [
              "id",
              "dao_id",
              "creator",
              "kind",
              "choices",
              "closes",
              "quorum",
              "approval",
              "denominator",
              "max_member",
              "cast",
              "tallies",
              "status",
              "winner",
              "metadata"
            ],
            "additionalProperties": false
          },
          "definition": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "ballot_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "dao_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "version": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 65535
                  },
                  "purpose": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 255
                  },
                  "policy_revision": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "policy_hash": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "ballot_id",
                  "dao_id",
                  "version",
                  "purpose",
                  "policy_revision",
                  "policy_hash",
                  "commitment"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "election": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "maxLength": 20
              },
              "dao_id": {
                "type": "string",
                "maxLength": 20
              },
              "creator": {
                "type": "string",
                "maxLength": 20
              },
              "title": {
                "type": "string",
                "maxLength": 16384
              },
              "document_id": {
                "type": "string",
                "maxLength": 20
              },
              "document_version": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "document_commitment": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "policy_revision": {
                "type": "string",
                "maxLength": 20
              },
              "nomination_close": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "term_start": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "term_end": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "seats": {
                "type": "integer",
                "minimum": 0,
                "maximum": 255
              },
              "status": {
                "type": "integer",
                "minimum": 0,
                "maximum": 255
              },
              "candidates": {
                "maxItems": 5000,
                "type": "array",
                "items": {
                  "type": "string",
                  "maxLength": 20
                }
              }
            },
            "required": [
              "id",
              "dao_id",
              "creator",
              "title",
              "document_id",
              "document_version",
              "document_commitment",
              "policy_revision",
              "nomination_close",
              "term_start",
              "term_end",
              "seats",
              "status",
              "candidates"
            ],
            "additionalProperties": false
          },
          "execution": {
            "type": "object",
            "properties": {
              "ballot_id": {
                "type": "string",
                "maxLength": 20
              },
              "dao_id": {
                "type": "string",
                "maxLength": 20
              },
              "works": {
                "type": "string",
                "maxLength": 13
              },
              "project_id": {
                "type": "string",
                "maxLength": 20
              },
              "commitment": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "works_hash": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "policy_revision": {
                "type": "string",
                "maxLength": 20
              },
              "deadline": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "executed": {
                "type": "boolean"
              }
            },
            "required": [
              "ballot_id",
              "dao_id",
              "works",
              "project_id",
              "commitment",
              "works_hash",
              "policy_revision",
              "deadline",
              "executed"
            ],
            "additionalProperties": false
          },
          "grantPlan": {
            "type": "object",
            "properties": {
              "ballot_id": {
                "type": "string",
                "maxLength": 20
              },
              "dao_id": {
                "type": "string",
                "maxLength": 20
              },
              "grants": {
                "type": "string",
                "maxLength": 13
              },
              "works": {
                "type": "string",
                "maxLength": 13
              },
              "round_id": {
                "type": "string",
                "maxLength": 20
              },
              "application_id": {
                "type": "string",
                "maxLength": 20
              },
              "application_revision": {
                "type": "string",
                "maxLength": 20
              },
              "project_id": {
                "type": "string",
                "maxLength": 20
              },
              "commitment": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "grants_hash": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "works_hash": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "policy_revision": {
                "type": "string",
                "maxLength": 20
              },
              "deadline": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "executed": {
                "type": "boolean"
              }
            },
            "required": [
              "ballot_id",
              "dao_id",
              "grants",
              "works",
              "round_id",
              "application_id",
              "application_revision",
              "project_id",
              "commitment",
              "grants_hash",
              "works_hash",
              "policy_revision",
              "deadline",
              "executed"
            ],
            "additionalProperties": false
          },
          "documentChange": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "maxLength": 20
              },
              "dao_id": {
                "type": "string",
                "maxLength": 20
              },
              "register_id": {
                "type": "string",
                "maxLength": 20
              },
              "document_id": {
                "type": "string",
                "maxLength": 20
              },
              "document_version": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "commitment": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "source_hash": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "expected_revision": {
                "type": "string",
                "maxLength": 20
              },
              "policy_revision": {
                "type": "string",
                "maxLength": 20
              },
              "ballot_id": {
                "type": "string",
                "maxLength": 20
              },
              "proposer": {
                "type": "string",
                "maxLength": 20
              },
              "proposed_at": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "deadline": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "adopted_at": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "adopted_by": {
                "type": "string",
                "maxLength": 20
              },
              "status": {
                "type": "integer",
                "minimum": 0,
                "maximum": 255
              }
            },
            "required": [
              "id",
              "dao_id",
              "register_id",
              "document_id",
              "document_version",
              "commitment",
              "source_hash",
              "expected_revision",
              "policy_revision",
              "ballot_id",
              "proposer",
              "proposed_at",
              "deadline",
              "adopted_at",
              "adopted_by",
              "status"
            ],
            "additionalProperties": false
          },
          "dispute": {
            "type": "object",
            "properties": {
              "ballot_id": {
                "type": "string",
                "maxLength": 20
              },
              "dao_id": {
                "type": "string",
                "maxLength": 20
              },
              "protection": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "source": {
                    "type": "string",
                    "maxLength": 13
                  },
                  "source_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "project_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "recipient": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "version": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 65535
                  },
                  "source_hash": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "terms": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "rules": {
                    "type": "object",
                    "properties": {
                      "decide": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "decide_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "backup": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "representative": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "kind": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 255
                      },
                      "quorum": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "approval": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "review_seconds": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "challenge_seconds": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "vote_seconds": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "backup_seconds": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      }
                    },
                    "required": [
                      "decide",
                      "decide_hash",
                      "backup",
                      "representative",
                      "kind",
                      "quorum",
                      "approval",
                      "review_seconds",
                      "challenge_seconds",
                      "vote_seconds",
                      "backup_seconds"
                    ],
                    "additionalProperties": false
                  },
                  "cutoff": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "reviewer": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "state": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 255
                  },
                  "deadline": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "ballot_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "decision_hash": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "consent_outcome": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 255
                  },
                  "consent_mask": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 255
                  },
                  "reviewers": {
                    "maxItems": 5000,
                    "type": "array",
                    "items": {
                      "type": "string",
                      "maxLength": 20
                    }
                  },
                  "submission_doc": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "review_doc": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "challenge_doc": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "submission_version": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "review_version": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "challenge_version": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "submission_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "review_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "challenge_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "id",
                  "source",
                  "source_id",
                  "project_id",
                  "recipient",
                  "version",
                  "source_hash",
                  "terms",
                  "rules",
                  "cutoff",
                  "reviewer",
                  "state",
                  "deadline",
                  "ballot_id",
                  "decision_hash",
                  "consent_outcome",
                  "consent_mask",
                  "reviewers",
                  "submission_doc",
                  "review_doc",
                  "challenge_doc",
                  "submission_version",
                  "review_version",
                  "challenge_version",
                  "submission_commitment",
                  "review_commitment",
                  "challenge_commitment"
                ],
                "additionalProperties": false
              },
              "quantity": {
                "type": "string",
                "maxLength": 64,
                "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
              },
              "due": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "voters": {
                "maxItems": 5000,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "member_id": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "weight": {
                      "type": "string",
                      "maxLength": 20
                    }
                  },
                  "required": [
                    "member_id",
                    "weight"
                  ],
                  "additionalProperties": false
                }
              },
              "executed": {
                "type": "boolean"
              },
              "version": {
                "type": "integer",
                "minimum": 0,
                "maximum": 65535
              },
              "cursor": {
                "type": "string",
                "maxLength": 20
              },
              "scanned": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "ready": {
                "type": "boolean"
              }
            },
            "required": [
              "ballot_id",
              "dao_id",
              "protection",
              "quantity",
              "due",
              "voters",
              "executed",
              "version",
              "cursor",
              "scanned",
              "ready"
            ],
            "additionalProperties": false
          },
          "target": {
            "type": "object",
            "properties": {
              "ballot_id": {
                "type": "string",
                "maxLength": 20
              },
              "dao_id": {
                "type": "string",
                "maxLength": 20
              },
              "version": {
                "type": "integer",
                "minimum": 0,
                "maximum": 65535
              },
              "work": {
                "type": "object",
                "properties": {
                  "project": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "creator": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "contributor": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "document_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "document_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "milestones": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "string",
                          "maxLength": 20
                        }
                      },
                      "status": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 255
                      }
                    },
                    "required": [
                      "id",
                      "dao_id",
                      "creator",
                      "contributor",
                      "document_id",
                      "document_version",
                      "milestones",
                      "status"
                    ],
                    "additionalProperties": false
                  },
                  "milestones": {
                    "maxItems": 5000,
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "dao_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "project_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "quantity": {
                          "type": "string",
                          "maxLength": 64,
                          "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
                        },
                        "due": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "status": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 255
                        },
                        "submission_doc": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "submission_version": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "review_doc": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "review_version": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "reviewer": {
                          "type": "string",
                          "maxLength": 20
                        }
                      },
                      "required": [
                        "id",
                        "dao_id",
                        "project_id",
                        "quantity",
                        "due",
                        "status",
                        "submission_doc",
                        "submission_version",
                        "review_doc",
                        "review_version",
                        "reviewer"
                      ],
                      "additionalProperties": false
                    }
                  },
                  "agreement": {
                    "type": "object",
                    "properties": {
                      "project_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "schema_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "term_start": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "term_end": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "terms": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "accepted": {
                        "type": "boolean"
                      },
                      "accepted_at": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      }
                    },
                    "required": [
                      "project_id",
                      "dao_id",
                      "schema_version",
                      "term_start",
                      "term_end",
                      "terms",
                      "accepted",
                      "accepted_at"
                    ],
                    "additionalProperties": false
                  },
                  "protection": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "contributor": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "cutoff": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "rules": {
                        "type": "object",
                        "properties": {
                          "decide": {
                            "type": "string",
                            "maxLength": 13
                          },
                          "decide_hash": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "backup": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "representative": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "kind": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 255
                          },
                          "quorum": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 65535
                          },
                          "approval": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 65535
                          },
                          "review_seconds": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          },
                          "challenge_seconds": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          },
                          "vote_seconds": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          },
                          "backup_seconds": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          }
                        },
                        "required": [
                          "decide",
                          "decide_hash",
                          "backup",
                          "representative",
                          "kind",
                          "quorum",
                          "approval",
                          "review_seconds",
                          "challenge_seconds",
                          "vote_seconds",
                          "backup_seconds"
                        ],
                        "additionalProperties": false
                      },
                      "base": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "commitment": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "accepted": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "id",
                      "dao_id",
                      "contributor",
                      "cutoff",
                      "version",
                      "rules",
                      "base",
                      "commitment",
                      "accepted"
                    ],
                    "additionalProperties": false
                  },
                  "document_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "project",
                  "milestones",
                  "document_commitment"
                ],
                "additionalProperties": false
              },
              "grant": {
                "type": "object",
                "properties": {
                  "round": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "creator": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "document_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "document_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "rules_revision": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "applications_close": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "review_close": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "awards_close": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "maximum": {
                        "type": "string",
                        "maxLength": 64,
                        "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
                      },
                      "awarded": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "allow_agents": {
                        "type": "boolean"
                      },
                      "works": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "closed": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "id",
                      "dao_id",
                      "creator",
                      "document_id",
                      "document_version",
                      "rules_revision",
                      "applications_close",
                      "review_close",
                      "awards_close",
                      "maximum",
                      "awarded",
                      "allow_agents",
                      "works",
                      "closed"
                    ],
                    "additionalProperties": false
                  },
                  "application": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "round_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "contributor": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "revision": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "document_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "document_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "payments": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "string",
                          "maxLength": 64,
                          "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
                        }
                      },
                      "dues": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        }
                      },
                      "term_start": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "term_end": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "status": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 255
                      },
                      "consent_at": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "decision_doc": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "decision_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "project_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "funding_ballot": {
                        "type": "string",
                        "maxLength": 20
                      }
                    },
                    "required": [
                      "id",
                      "dao_id",
                      "round_id",
                      "contributor",
                      "revision",
                      "document_id",
                      "document_version",
                      "payments",
                      "dues",
                      "term_start",
                      "term_end",
                      "status",
                      "consent_at",
                      "decision_doc",
                      "decision_version",
                      "project_id",
                      "funding_ballot"
                    ],
                    "additionalProperties": false
                  },
                  "protection": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "contributor": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "cutoff": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "rules": {
                        "type": "object",
                        "properties": {
                          "decide": {
                            "type": "string",
                            "maxLength": 13
                          },
                          "decide_hash": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "backup": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "representative": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "kind": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 255
                          },
                          "quorum": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 65535
                          },
                          "approval": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 65535
                          },
                          "review_seconds": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          },
                          "challenge_seconds": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          },
                          "vote_seconds": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          },
                          "backup_seconds": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          }
                        },
                        "required": [
                          "decide",
                          "decide_hash",
                          "backup",
                          "representative",
                          "kind",
                          "quorum",
                          "approval",
                          "review_seconds",
                          "challenge_seconds",
                          "vote_seconds",
                          "backup_seconds"
                        ],
                        "additionalProperties": false
                      },
                      "base": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "commitment": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "accepted": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "id",
                      "dao_id",
                      "contributor",
                      "cutoff",
                      "version",
                      "rules",
                      "base",
                      "commitment",
                      "accepted"
                    ],
                    "additionalProperties": false
                  },
                  "rules_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "application_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "decision_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "round",
                  "application",
                  "rules_commitment",
                  "application_commitment",
                  "decision_commitment"
                ],
                "additionalProperties": false
              },
              "released": {
                "type": "boolean"
              }
            },
            "required": [
              "ballot_id",
              "dao_id",
              "version",
              "released"
            ],
            "additionalProperties": false
          },
          "votes": {
            "maxItems": 5000,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "ballot": {
                  "type": "string",
                  "maxLength": 20
                },
                "member": {
                  "type": "string",
                  "maxLength": 20
                },
                "weight": {
                  "type": "string",
                  "maxLength": 20
                },
                "choice": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                }
              },
              "required": [
                "id",
                "ballot",
                "member",
                "weight",
                "choice"
              ],
              "additionalProperties": false
            }
          },
          "verification": {
            "type": "string",
            "enum": [
              "verified",
              "legacy-unbound"
            ]
          },
          "coverage": {
            "type": "string",
            "enum": [
              "complete-live",
              "partial-live"
            ]
          },
          "archiveNotice": {
            "type": "string",
            "const": "Archived vote rows are not included; partial-live is not a complete history."
          }
        },
        "required": [
          "schemaVersion",
          "dao",
          "decide",
          "ballot",
          "definition",
          "votes",
          "verification",
          "coverage",
          "archiveNotice"
        ],
        "additionalProperties": false
      },
      "helpTopic": "decide"
    },
    {
      "method": "POST",
      "path": "/v1/decide/clear-documents",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "proposalIds": {
            "minItems": 1,
            "maxItems": 25,
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 20
            }
          }
        },
        "required": [
          "dao",
          "proposalIds"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "transactionId": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          }
        },
        "required": [
          "transactionId"
        ],
        "additionalProperties": false
      },
      "helpTopic": "governing-documents"
    },
    {
      "method": "GET",
      "path": "/v1/daos/:id/governing-documents",
      "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "registerId": {
            "type": "string",
            "maxLength": 20
          },
          "adoptionId": {
            "type": "string",
            "maxLength": 20
          },
          "after": {
            "type": "string",
            "maxLength": 20
          },
          "memberId": {
            "type": "string",
            "maxLength": 20
          }
        },
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "available": {
            "type": "boolean"
          },
          "module": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "deployment": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "enum": [
                          "decide",
                          "works",
                          "payroll",
                          "grants-rounds",
                          "endorsement-admission",
                          "activity",
                          "quick-ballots"
                        ]
                      },
                      "account": {
                        "type": "string",
                        "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                      },
                      "version": {
                        "type": "string"
                      },
                      "codeHash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      }
                    },
                    "required": [
                      "id",
                      "account",
                      "version",
                      "codeHash"
                    ],
                    "additionalProperties": false
                  },
                  "manifest": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "pattern": "^[a-z][a-z0-9-]{0,31}$"
                      },
                      "version": {
                        "type": "string"
                      },
                      "coreRange": {
                        "type": "string"
                      },
                      "interfaceVersion": {
                        "type": "number",
                        "const": 1
                      },
                      "configVersion": {
                        "type": "integer",
                        "minimum": 1,
                        "maximum": 9007199254740991
                      },
                      "capabilities": {
                        "maxItems": 16,
                        "type": "array",
                        "items": {
                          "type": "string",
                          "enum": [
                            "ballot.create",
                            "ballot.finalize",
                            "ballot.execute",
                            "obligation.create",
                            "obligation.execute",
                            "member.manage",
                            "credit.issue",
                            "content.publish",
                            "notification.send"
                          ]
                        }
                      },
                      "helpTopic": {
                        "type": "string",
                        "pattern": "^[a-z][a-z0-9.-]{1,63}$"
                      }
                    },
                    "required": [
                      "id",
                      "version",
                      "coreRange",
                      "interfaceVersion",
                      "configVersion",
                      "capabilities",
                      "helpTopic"
                    ],
                    "additionalProperties": false
                  },
                  "enabled": {
                    "type": "boolean"
                  },
                  "installed": {
                    "default": false,
                    "type": "boolean"
                  },
                  "compatible": {
                    "type": "boolean"
                  },
                  "codeVerified": {
                    "type": "boolean"
                  },
                  "actions": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                    }
                  },
                  "grants": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                    }
                  }
                },
                "required": [
                  "deployment",
                  "manifest",
                  "enabled",
                  "installed",
                  "compatible",
                  "codeVerified",
                  "actions",
                  "grants"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "policyRevision": {
            "default": null,
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "null"
              }
            ]
          },
          "registrations": {
            "maxItems": 25,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "category": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "approval": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "track_acceptance": {
                  "type": "boolean"
                },
                "revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "adopted_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "pending_id": {
                  "type": "string",
                  "maxLength": 20
                }
              },
              "required": [
                "id",
                "dao_id",
                "document_id",
                "category",
                "approval",
                "track_acceptance",
                "revision",
                "adopted_id",
                "pending_id"
              ],
              "additionalProperties": false
            }
          },
          "changes": {
            "maxItems": 50,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "register_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "source_hash": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "expected_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "policy_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "ballot_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "proposer": {
                  "type": "string",
                  "maxLength": 20
                },
                "proposed_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "deadline": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "adopted_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "adopted_by": {
                  "type": "string",
                  "maxLength": 20
                },
                "status": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                }
              },
              "required": [
                "id",
                "dao_id",
                "register_id",
                "document_id",
                "document_version",
                "commitment",
                "source_hash",
                "expected_revision",
                "policy_revision",
                "ballot_id",
                "proposer",
                "proposed_at",
                "deadline",
                "adopted_at",
                "adopted_by",
                "status"
              ],
              "additionalProperties": false
            }
          },
          "acceptances": {
            "maxItems": 25,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "adoption_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "member_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "accepted_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                }
              },
              "required": [
                "id",
                "dao_id",
                "adoption_id",
                "member_id",
                "accepted_at"
              ],
              "additionalProperties": false
            }
          },
          "acceptedAdoptionIds": {
            "maxItems": 25,
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 20
            }
          },
          "ballots": {
            "maxItems": 50,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "creator": {
                  "type": "string",
                  "maxLength": 20
                },
                "kind": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "choices": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "closes": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "quorum": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                },
                "approval": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                },
                "denominator": {
                  "type": "string",
                  "maxLength": 20
                },
                "max_member": {
                  "type": "string",
                  "maxLength": 20
                },
                "cast": {
                  "type": "string",
                  "maxLength": 20
                },
                "tallies": {
                  "maxItems": 5000,
                  "type": "array",
                  "items": {
                    "type": "string",
                    "maxLength": 20
                  }
                },
                "status": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "winner": {
                  "type": "integer",
                  "minimum": -32768,
                  "maximum": 32767
                },
                "metadata": {
                  "type": "string",
                  "maxLength": 16384
                }
              },
              "required": [
                "id",
                "dao_id",
                "creator",
                "kind",
                "choices",
                "closes",
                "quorum",
                "approval",
                "denominator",
                "max_member",
                "cast",
                "tallies",
                "status",
                "winner",
                "metadata"
              ],
              "additionalProperties": false
            }
          },
          "ballotDefinitions": {
            "default": [],
            "maxItems": 50,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "ballot_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                },
                "purpose": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "policy_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "policy_hash": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                }
              },
              "required": [
                "ballot_id",
                "dao_id",
                "version",
                "purpose",
                "policy_revision",
                "policy_hash",
                "commitment"
              ],
              "additionalProperties": false
            }
          },
          "votes": {
            "maxItems": 50,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "ballot": {
                  "type": "string",
                  "maxLength": 20
                },
                "member": {
                  "type": "string",
                  "maxLength": 20
                },
                "weight": {
                  "type": "string",
                  "maxLength": 20
                },
                "choice": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                }
              },
              "required": [
                "id",
                "ballot",
                "member",
                "weight",
                "choice"
              ],
              "additionalProperties": false
            }
          },
          "next": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "dao",
          "available",
          "module",
          "policyRevision",
          "registrations",
          "changes",
          "acceptances",
          "acceptedAdoptionIds",
          "ballots",
          "ballotDefinitions",
          "votes",
          "next"
        ],
        "additionalProperties": false
      },
      "helpTopic": "governing-documents"
    },
    {
      "method": "GET",
      "path": "/v1/daos/:id/apps/:appId/keys",
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "appId": {
            "type": "string",
            "maxLength": 20
          },
          "currentEpoch": {
            "default": "0",
            "type": "string",
            "maxLength": 20
          },
          "keys": {
            "maxItems": 128,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "app_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "security_epoch": {
                  "type": "string",
                  "maxLength": 20
                },
                "app_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "max_member": {
                  "type": "string",
                  "maxLength": 20
                },
                "key_commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "created_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                }
              },
              "required": [
                "id",
                "dao_id",
                "app_id",
                "security_epoch",
                "app_revision",
                "max_member",
                "key_commitment",
                "created_at"
              ],
              "additionalProperties": false
            }
          },
          "grants": {
            "maxItems": 128,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "key_epoch": {
                  "type": "string",
                  "maxLength": 20
                },
                "recipient": {
                  "type": "string",
                  "maxLength": 20
                },
                "encryption_key": {
                  "type": "string",
                  "maxLength": 16384
                },
                "envelope": {
                  "type": "string",
                  "maxLength": 16384
                }
              },
              "required": [
                "id",
                "dao_id",
                "key_epoch",
                "recipient",
                "encryption_key",
                "envelope"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "dao",
          "appId",
          "currentEpoch",
          "keys",
          "grants"
        ],
        "additionalProperties": false
      },
      "helpTopic": "activity"
    },
    {
      "method": "GET",
      "path": "/v1/daos/:id/modules",
      "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "activities": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "ballots": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "projects": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "schedules": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "elections": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "terms": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "joinApplications": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "rounds": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "applications": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "string",
                "const": "done"
              }
            ]
          },
          "memberId": {
            "type": "string",
            "maxLength": 20
          }
        },
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "next": {
            "default": {
              "ballots": null,
              "projects": null,
              "schedules": null,
              "rounds": null,
              "applications": null,
              "joinApplications": null,
              "elections": null,
              "terms": null,
              "activities": null
            },
            "type": "object",
            "properties": {
              "activities": {
                "default": null,
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "ballots": {
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "projects": {
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "schedules": {
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "elections": {
                "default": null,
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "terms": {
                "default": null,
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "joinApplications": {
                "default": null,
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "rounds": {
                "default": null,
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "applications": {
                "default": null,
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 20
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            },
            "required": [
              "activities",
              "ballots",
              "projects",
              "schedules",
              "elections",
              "terms",
              "joinApplications",
              "rounds",
              "applications"
            ],
            "additionalProperties": false
          },
          "modules": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "deployment": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "enum": [
                        "decide",
                        "works",
                        "payroll",
                        "grants-rounds",
                        "endorsement-admission",
                        "activity",
                        "quick-ballots"
                      ]
                    },
                    "account": {
                      "type": "string",
                      "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                    },
                    "version": {
                      "type": "string"
                    },
                    "codeHash": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    }
                  },
                  "required": [
                    "id",
                    "account",
                    "version",
                    "codeHash"
                  ],
                  "additionalProperties": false
                },
                "manifest": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "pattern": "^[a-z][a-z0-9-]{0,31}$"
                    },
                    "version": {
                      "type": "string"
                    },
                    "coreRange": {
                      "type": "string"
                    },
                    "interfaceVersion": {
                      "type": "number",
                      "const": 1
                    },
                    "configVersion": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 9007199254740991
                    },
                    "capabilities": {
                      "maxItems": 16,
                      "type": "array",
                      "items": {
                        "type": "string",
                        "enum": [
                          "ballot.create",
                          "ballot.finalize",
                          "ballot.execute",
                          "obligation.create",
                          "obligation.execute",
                          "member.manage",
                          "credit.issue",
                          "content.publish",
                          "notification.send"
                        ]
                      }
                    },
                    "helpTopic": {
                      "type": "string",
                      "pattern": "^[a-z][a-z0-9.-]{1,63}$"
                    }
                  },
                  "required": [
                    "id",
                    "version",
                    "coreRange",
                    "interfaceVersion",
                    "configVersion",
                    "capabilities",
                    "helpTopic"
                  ],
                  "additionalProperties": false
                },
                "enabled": {
                  "type": "boolean"
                },
                "installed": {
                  "default": false,
                  "type": "boolean"
                },
                "compatible": {
                  "type": "boolean"
                },
                "codeVerified": {
                  "type": "boolean"
                },
                "actions": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                  }
                },
                "grants": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                  }
                }
              },
              "required": [
                "deployment",
                "manifest",
                "enabled",
                "installed",
                "compatible",
                "codeVerified",
                "actions",
                "grants"
              ],
              "additionalProperties": false
            }
          },
          "activities": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "app_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "actor": {
                  "type": "string",
                  "maxLength": 20
                },
                "kind": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "source_id": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "source_revision": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "event_id": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "evidence_cid": {
                  "type": "string",
                  "maxLength": 16384
                },
                "evidence_hash": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "key_epoch": {
                  "type": "string",
                  "maxLength": 20
                },
                "created_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "status": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                }
              },
              "required": [
                "id",
                "dao_id",
                "app_id",
                "actor",
                "kind",
                "source_id",
                "source_revision",
                "event_id",
                "evidence_cid",
                "evidence_hash",
                "key_epoch",
                "created_at",
                "status"
              ],
              "additionalProperties": false
            }
          },
          "activityReviews": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "reviewer": {
                  "type": "string",
                  "maxLength": 20
                },
                "accepted": {
                  "type": "boolean"
                },
                "evidence_cid": {
                  "type": "string",
                  "maxLength": 16384
                },
                "evidence_hash": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "key_epoch": {
                  "type": "string",
                  "maxLength": 20
                },
                "reviewed_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                }
              },
              "required": [
                "id",
                "dao_id",
                "reviewer",
                "accepted",
                "evidence_cid",
                "evidence_hash",
                "key_epoch",
                "reviewed_at"
              ],
              "additionalProperties": false
            }
          },
          "activityDecisions": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "decide": {
                  "type": "string",
                  "maxLength": 13
                },
                "ballot_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "metadata_hash": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                }
              },
              "required": [
                "id",
                "dao_id",
                "decide",
                "ballot_id",
                "metadata_hash"
              ],
              "additionalProperties": false
            }
          },
          "appKeys": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "app_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "security_epoch": {
                  "type": "string",
                  "maxLength": 20
                },
                "app_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "max_member": {
                  "type": "string",
                  "maxLength": 20
                },
                "key_commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "created_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                }
              },
              "required": [
                "id",
                "dao_id",
                "app_id",
                "security_epoch",
                "app_revision",
                "max_member",
                "key_commitment",
                "created_at"
              ],
              "additionalProperties": false
            }
          },
          "appKeyGrants": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "key_epoch": {
                  "type": "string",
                  "maxLength": 20
                },
                "recipient": {
                  "type": "string",
                  "maxLength": 20
                },
                "encryption_key": {
                  "type": "string",
                  "maxLength": 16384
                },
                "envelope": {
                  "type": "string",
                  "maxLength": 16384
                }
              },
              "required": [
                "id",
                "dao_id",
                "key_epoch",
                "recipient",
                "encryption_key",
                "envelope"
              ],
              "additionalProperties": false
            }
          },
          "ballots": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "creator": {
                  "type": "string",
                  "maxLength": 20
                },
                "kind": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "choices": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "closes": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "quorum": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                },
                "approval": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                },
                "denominator": {
                  "type": "string",
                  "maxLength": 20
                },
                "max_member": {
                  "type": "string",
                  "maxLength": 20
                },
                "cast": {
                  "type": "string",
                  "maxLength": 20
                },
                "tallies": {
                  "maxItems": 5000,
                  "type": "array",
                  "items": {
                    "type": "string",
                    "maxLength": 20
                  }
                },
                "status": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "winner": {
                  "type": "integer",
                  "minimum": -32768,
                  "maximum": 32767
                },
                "metadata": {
                  "type": "string",
                  "maxLength": 16384
                }
              },
              "required": [
                "id",
                "dao_id",
                "creator",
                "kind",
                "choices",
                "closes",
                "quorum",
                "approval",
                "denominator",
                "max_member",
                "cast",
                "tallies",
                "status",
                "winner",
                "metadata"
              ],
              "additionalProperties": false
            }
          },
          "ballotDefinitions": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "ballot_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                },
                "purpose": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "policy_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "policy_hash": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                }
              },
              "required": [
                "ballot_id",
                "dao_id",
                "version",
                "purpose",
                "policy_revision",
                "policy_hash",
                "commitment"
              ],
              "additionalProperties": false
            }
          },
          "ballotTargets": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "ballot_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                },
                "work": {
                  "type": "object",
                  "properties": {
                    "project": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "dao_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "creator": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "contributor": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "document_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "document_version": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "milestones": {
                          "maxItems": 5000,
                          "type": "array",
                          "items": {
                            "type": "string",
                            "maxLength": 20
                          }
                        },
                        "status": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 255
                        }
                      },
                      "required": [
                        "id",
                        "dao_id",
                        "creator",
                        "contributor",
                        "document_id",
                        "document_version",
                        "milestones",
                        "status"
                      ],
                      "additionalProperties": false
                    },
                    "milestones": {
                      "maxItems": 5000,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "dao_id": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "project_id": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "quantity": {
                            "type": "string",
                            "maxLength": 64,
                            "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
                          },
                          "due": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          },
                          "status": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 255
                          },
                          "submission_doc": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "submission_version": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          },
                          "review_doc": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "review_version": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          },
                          "reviewer": {
                            "type": "string",
                            "maxLength": 20
                          }
                        },
                        "required": [
                          "id",
                          "dao_id",
                          "project_id",
                          "quantity",
                          "due",
                          "status",
                          "submission_doc",
                          "submission_version",
                          "review_doc",
                          "review_version",
                          "reviewer"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "agreement": {
                      "type": "object",
                      "properties": {
                        "project_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "dao_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "schema_version": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 65535
                        },
                        "term_start": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "term_end": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "terms": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "accepted": {
                          "type": "boolean"
                        },
                        "accepted_at": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        }
                      },
                      "required": [
                        "project_id",
                        "dao_id",
                        "schema_version",
                        "term_start",
                        "term_end",
                        "terms",
                        "accepted",
                        "accepted_at"
                      ],
                      "additionalProperties": false
                    },
                    "protection": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "dao_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "contributor": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "cutoff": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "version": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 65535
                        },
                        "rules": {
                          "type": "object",
                          "properties": {
                            "decide": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "decide_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "backup": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "representative": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "kind": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "quorum": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 65535
                            },
                            "approval": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 65535
                            },
                            "review_seconds": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "challenge_seconds": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "vote_seconds": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "backup_seconds": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            }
                          },
                          "required": [
                            "decide",
                            "decide_hash",
                            "backup",
                            "representative",
                            "kind",
                            "quorum",
                            "approval",
                            "review_seconds",
                            "challenge_seconds",
                            "vote_seconds",
                            "backup_seconds"
                          ],
                          "additionalProperties": false
                        },
                        "base": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "commitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "accepted": {
                          "type": "boolean"
                        }
                      },
                      "required": [
                        "id",
                        "dao_id",
                        "contributor",
                        "cutoff",
                        "version",
                        "rules",
                        "base",
                        "commitment",
                        "accepted"
                      ],
                      "additionalProperties": false
                    },
                    "document_commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    }
                  },
                  "required": [
                    "project",
                    "milestones",
                    "document_commitment"
                  ],
                  "additionalProperties": false
                },
                "grant": {
                  "type": "object",
                  "properties": {
                    "round": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "dao_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "creator": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "document_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "document_version": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "rules_revision": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "applications_close": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "review_close": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "awards_close": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "maximum": {
                          "type": "string",
                          "maxLength": 64,
                          "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
                        },
                        "awarded": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "allow_agents": {
                          "type": "boolean"
                        },
                        "works": {
                          "type": "string",
                          "maxLength": 13
                        },
                        "closed": {
                          "type": "boolean"
                        }
                      },
                      "required": [
                        "id",
                        "dao_id",
                        "creator",
                        "document_id",
                        "document_version",
                        "rules_revision",
                        "applications_close",
                        "review_close",
                        "awards_close",
                        "maximum",
                        "awarded",
                        "allow_agents",
                        "works",
                        "closed"
                      ],
                      "additionalProperties": false
                    },
                    "application": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "dao_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "round_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "contributor": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "revision": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "document_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "document_version": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "payments": {
                          "maxItems": 5000,
                          "type": "array",
                          "items": {
                            "type": "string",
                            "maxLength": 64,
                            "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
                          }
                        },
                        "dues": {
                          "maxItems": 5000,
                          "type": "array",
                          "items": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          }
                        },
                        "term_start": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "term_end": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "status": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 255
                        },
                        "consent_at": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "decision_doc": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "decision_version": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "project_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "funding_ballot": {
                          "type": "string",
                          "maxLength": 20
                        }
                      },
                      "required": [
                        "id",
                        "dao_id",
                        "round_id",
                        "contributor",
                        "revision",
                        "document_id",
                        "document_version",
                        "payments",
                        "dues",
                        "term_start",
                        "term_end",
                        "status",
                        "consent_at",
                        "decision_doc",
                        "decision_version",
                        "project_id",
                        "funding_ballot"
                      ],
                      "additionalProperties": false
                    },
                    "protection": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "dao_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "contributor": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "cutoff": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "version": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 65535
                        },
                        "rules": {
                          "type": "object",
                          "properties": {
                            "decide": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "decide_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "backup": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "representative": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "kind": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "quorum": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 65535
                            },
                            "approval": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 65535
                            },
                            "review_seconds": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "challenge_seconds": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "vote_seconds": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "backup_seconds": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            }
                          },
                          "required": [
                            "decide",
                            "decide_hash",
                            "backup",
                            "representative",
                            "kind",
                            "quorum",
                            "approval",
                            "review_seconds",
                            "challenge_seconds",
                            "vote_seconds",
                            "backup_seconds"
                          ],
                          "additionalProperties": false
                        },
                        "base": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "commitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "accepted": {
                          "type": "boolean"
                        }
                      },
                      "required": [
                        "id",
                        "dao_id",
                        "contributor",
                        "cutoff",
                        "version",
                        "rules",
                        "base",
                        "commitment",
                        "accepted"
                      ],
                      "additionalProperties": false
                    },
                    "rules_commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "application_commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "decision_commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    }
                  },
                  "required": [
                    "round",
                    "application",
                    "rules_commitment",
                    "application_commitment",
                    "decision_commitment"
                  ],
                  "additionalProperties": false
                },
                "released": {
                  "type": "boolean"
                }
              },
              "required": [
                "ballot_id",
                "dao_id",
                "version",
                "released"
              ],
              "additionalProperties": false
            }
          },
          "documentChanges": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "register_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "source_hash": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "expected_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "policy_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "ballot_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "proposer": {
                  "type": "string",
                  "maxLength": 20
                },
                "proposed_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "deadline": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "adopted_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "adopted_by": {
                  "type": "string",
                  "maxLength": 20
                },
                "status": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                }
              },
              "required": [
                "id",
                "dao_id",
                "register_id",
                "document_id",
                "document_version",
                "commitment",
                "source_hash",
                "expected_revision",
                "policy_revision",
                "ballot_id",
                "proposer",
                "proposed_at",
                "deadline",
                "adopted_at",
                "adopted_by",
                "status"
              ],
              "additionalProperties": false
            }
          },
          "arbitrationPlans": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "ballot_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "protection": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "source": {
                      "type": "string",
                      "maxLength": 13
                    },
                    "source_id": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "project_id": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "recipient": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "version": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 65535
                    },
                    "source_hash": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "terms": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "rules": {
                      "type": "object",
                      "properties": {
                        "decide": {
                          "type": "string",
                          "maxLength": 13
                        },
                        "decide_hash": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "backup": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "representative": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "kind": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 255
                        },
                        "quorum": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 65535
                        },
                        "approval": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 65535
                        },
                        "review_seconds": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "challenge_seconds": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "vote_seconds": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "backup_seconds": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        }
                      },
                      "required": [
                        "decide",
                        "decide_hash",
                        "backup",
                        "representative",
                        "kind",
                        "quorum",
                        "approval",
                        "review_seconds",
                        "challenge_seconds",
                        "vote_seconds",
                        "backup_seconds"
                      ],
                      "additionalProperties": false
                    },
                    "cutoff": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "reviewer": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "state": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 255
                    },
                    "deadline": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "ballot_id": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "decision_hash": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "consent_outcome": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 255
                    },
                    "consent_mask": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 255
                    },
                    "reviewers": {
                      "maxItems": 5000,
                      "type": "array",
                      "items": {
                        "type": "string",
                        "maxLength": 20
                      }
                    },
                    "submission_doc": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "review_doc": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "challenge_doc": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "submission_version": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "review_version": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "challenge_version": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "submission_commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "review_commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "challenge_commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    }
                  },
                  "required": [
                    "id",
                    "source",
                    "source_id",
                    "project_id",
                    "recipient",
                    "version",
                    "source_hash",
                    "terms",
                    "rules",
                    "cutoff",
                    "reviewer",
                    "state",
                    "deadline",
                    "ballot_id",
                    "decision_hash",
                    "consent_outcome",
                    "consent_mask",
                    "reviewers",
                    "submission_doc",
                    "review_doc",
                    "challenge_doc",
                    "submission_version",
                    "review_version",
                    "challenge_version",
                    "submission_commitment",
                    "review_commitment",
                    "challenge_commitment"
                  ],
                  "additionalProperties": false
                },
                "quantity": {
                  "type": "string",
                  "maxLength": 64,
                  "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
                },
                "due": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "voters": {
                  "maxItems": 5000,
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "member_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "weight": {
                        "type": "string",
                        "maxLength": 20
                      }
                    },
                    "required": [
                      "member_id",
                      "weight"
                    ],
                    "additionalProperties": false
                  }
                },
                "executed": {
                  "type": "boolean"
                },
                "version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                },
                "cursor": {
                  "type": "string",
                  "maxLength": 20
                },
                "scanned": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "ready": {
                  "type": "boolean"
                }
              },
              "required": [
                "ballot_id",
                "dao_id",
                "protection",
                "quantity",
                "due",
                "voters",
                "executed",
                "version",
                "cursor",
                "scanned",
                "ready"
              ],
              "additionalProperties": false
            }
          },
          "protectedWorksTerms": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "contributor": {
                  "type": "string",
                  "maxLength": 20
                },
                "cutoff": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                },
                "rules": {
                  "type": "object",
                  "properties": {
                    "decide": {
                      "type": "string",
                      "maxLength": 13
                    },
                    "decide_hash": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "backup": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "representative": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "kind": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 255
                    },
                    "quorum": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 65535
                    },
                    "approval": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 65535
                    },
                    "review_seconds": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "challenge_seconds": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "vote_seconds": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "backup_seconds": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    }
                  },
                  "required": [
                    "decide",
                    "decide_hash",
                    "backup",
                    "representative",
                    "kind",
                    "quorum",
                    "approval",
                    "review_seconds",
                    "challenge_seconds",
                    "vote_seconds",
                    "backup_seconds"
                  ],
                  "additionalProperties": false
                },
                "base": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "accepted": {
                  "type": "boolean"
                }
              },
              "required": [
                "id",
                "dao_id",
                "contributor",
                "cutoff",
                "version",
                "rules",
                "base",
                "commitment",
                "accepted"
              ],
              "additionalProperties": false
            }
          },
          "protectedGrantTerms": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "contributor": {
                  "type": "string",
                  "maxLength": 20
                },
                "cutoff": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                },
                "rules": {
                  "type": "object",
                  "properties": {
                    "decide": {
                      "type": "string",
                      "maxLength": 13
                    },
                    "decide_hash": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "backup": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "representative": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "kind": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 255
                    },
                    "quorum": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 65535
                    },
                    "approval": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 65535
                    },
                    "review_seconds": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "challenge_seconds": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "vote_seconds": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "backup_seconds": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    }
                  },
                  "required": [
                    "decide",
                    "decide_hash",
                    "backup",
                    "representative",
                    "kind",
                    "quorum",
                    "approval",
                    "review_seconds",
                    "challenge_seconds",
                    "vote_seconds",
                    "backup_seconds"
                  ],
                  "additionalProperties": false
                },
                "base": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "accepted": {
                  "type": "boolean"
                }
              },
              "required": [
                "id",
                "dao_id",
                "contributor",
                "cutoff",
                "version",
                "rules",
                "base",
                "commitment",
                "accepted"
              ],
              "additionalProperties": false
            }
          },
          "votes": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "ballot": {
                  "type": "string",
                  "maxLength": 20
                },
                "member": {
                  "type": "string",
                  "maxLength": 20
                },
                "weight": {
                  "type": "string",
                  "maxLength": 20
                },
                "choice": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                }
              },
              "required": [
                "id",
                "ballot",
                "member",
                "weight",
                "choice"
              ],
              "additionalProperties": false
            }
          },
          "projects": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "creator": {
                  "type": "string",
                  "maxLength": 20
                },
                "contributor": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "milestones": {
                  "maxItems": 5000,
                  "type": "array",
                  "items": {
                    "type": "string",
                    "maxLength": 20
                  }
                },
                "status": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                }
              },
              "required": [
                "id",
                "dao_id",
                "creator",
                "contributor",
                "document_id",
                "document_version",
                "milestones",
                "status"
              ],
              "additionalProperties": false
            }
          },
          "milestones": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "project_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "quantity": {
                  "type": "string",
                  "maxLength": 64,
                  "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
                },
                "due": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "status": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "submission_doc": {
                  "type": "string",
                  "maxLength": 20
                },
                "submission_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "review_doc": {
                  "type": "string",
                  "maxLength": 20
                },
                "review_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "reviewer": {
                  "type": "string",
                  "maxLength": 20
                }
              },
              "required": [
                "id",
                "dao_id",
                "project_id",
                "quantity",
                "due",
                "status",
                "submission_doc",
                "submission_version",
                "review_doc",
                "review_version",
                "reviewer"
              ],
              "additionalProperties": false
            }
          },
          "agreements": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "project_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "schema_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                },
                "term_start": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "term_end": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "terms": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "accepted": {
                  "type": "boolean"
                },
                "accepted_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                }
              },
              "required": [
                "project_id",
                "dao_id",
                "schema_version",
                "term_start",
                "term_end",
                "terms",
                "accepted",
                "accepted_at"
              ],
              "additionalProperties": false
            }
          },
          "schedules": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "creator": {
                  "type": "string",
                  "maxLength": 20
                },
                "recipient": {
                  "type": "string",
                  "maxLength": 20
                },
                "quantity": {
                  "type": "string",
                  "maxLength": 64,
                  "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
                },
                "periods": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "interval": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "starts": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "entries": {
                  "maxItems": 5000,
                  "type": "array",
                  "items": {
                    "type": "string",
                    "maxLength": 20
                  }
                }
              },
              "required": [
                "id",
                "dao_id",
                "creator",
                "recipient",
                "quantity",
                "periods",
                "interval",
                "starts",
                "entries"
              ],
              "additionalProperties": false
            }
          },
          "entries": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "schedule_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "due": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                }
              },
              "required": [
                "id",
                "dao_id",
                "schedule_id",
                "due"
              ],
              "additionalProperties": false
            }
          },
          "controls": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "schedule_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "paused": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "last_payout": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "label": {
                  "type": "string",
                  "maxLength": 16384
                }
              },
              "required": [
                "schedule_id",
                "paused",
                "last_payout",
                "label"
              ],
              "additionalProperties": false
            }
          },
          "payrollTerms": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "schedule_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "label": {
                  "type": "string",
                  "maxLength": 16384
                },
                "successor_of": {
                  "type": "string",
                  "maxLength": 20
                },
                "schema_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                },
                "references_released": {
                  "type": "boolean"
                }
              },
              "required": [
                "schedule_id",
                "dao_id",
                "document_id",
                "document_version",
                "commitment",
                "label",
                "successor_of",
                "schema_version",
                "references_released"
              ],
              "additionalProperties": false
            }
          },
          "elections": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "creator": {
                  "type": "string",
                  "maxLength": 20
                },
                "title": {
                  "type": "string",
                  "maxLength": 16384
                },
                "document_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "document_commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "policy_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "nomination_close": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "term_start": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "term_end": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "seats": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "status": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "candidates": {
                  "maxItems": 5000,
                  "type": "array",
                  "items": {
                    "type": "string",
                    "maxLength": 20
                  }
                }
              },
              "required": [
                "id",
                "dao_id",
                "creator",
                "title",
                "document_id",
                "document_version",
                "document_commitment",
                "policy_revision",
                "nomination_close",
                "term_start",
                "term_end",
                "seats",
                "status",
                "candidates"
              ],
              "additionalProperties": false
            }
          },
          "nominations": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "election_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "member_id": {
                  "type": "string",
                  "maxLength": 20
                }
              },
              "required": [
                "id",
                "dao_id",
                "election_id",
                "member_id"
              ],
              "additionalProperties": false
            }
          },
          "terms": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "election_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "member_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "title": {
                  "type": "string",
                  "maxLength": 16384
                },
                "starts": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "ends": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "recalled": {
                  "type": "boolean"
                },
                "recalled_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "recall_doc": {
                  "type": "string",
                  "maxLength": 20
                },
                "recall_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                }
              },
              "required": [
                "id",
                "dao_id",
                "election_id",
                "member_id",
                "title",
                "starts",
                "ends",
                "recalled",
                "recalled_at",
                "recall_doc",
                "recall_version"
              ],
              "additionalProperties": false
            }
          },
          "joinApplications": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "sponsor": {
                  "type": "string",
                  "maxLength": 20
                },
                "revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "policy_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "signing_key": {
                  "type": "string",
                  "maxLength": 128
                },
                "encryption_key": {
                  "type": "string",
                  "maxLength": 16384
                },
                "custody": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "kind": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "operator_label": {
                  "type": "string",
                  "maxLength": 16384
                },
                "document_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "document_commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "expires": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "witnesses": {
                  "maxItems": 5000,
                  "type": "array",
                  "items": {
                    "type": "string",
                    "maxLength": 20
                  }
                },
                "admitted": {
                  "type": "boolean"
                },
                "member_id": {
                  "type": "string",
                  "maxLength": 20
                }
              },
              "required": [
                "id",
                "dao_id",
                "sponsor",
                "revision",
                "policy_revision",
                "signing_key",
                "encryption_key",
                "custody",
                "kind",
                "operator_label",
                "document_id",
                "document_version",
                "document_commitment",
                "expires",
                "witnesses",
                "admitted",
                "member_id"
              ],
              "additionalProperties": false
            }
          },
          "rounds": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "creator": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "rules_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "applications_close": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "review_close": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "awards_close": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "maximum": {
                  "type": "string",
                  "maxLength": 64,
                  "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
                },
                "awarded": {
                  "type": "string",
                  "maxLength": 20
                },
                "allow_agents": {
                  "type": "boolean"
                },
                "works": {
                  "type": "string",
                  "maxLength": 13
                },
                "closed": {
                  "type": "boolean"
                }
              },
              "required": [
                "id",
                "dao_id",
                "creator",
                "document_id",
                "document_version",
                "rules_revision",
                "applications_close",
                "review_close",
                "awards_close",
                "maximum",
                "awarded",
                "allow_agents",
                "works",
                "closed"
              ],
              "additionalProperties": false
            }
          },
          "applications": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "round_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "contributor": {
                  "type": "string",
                  "maxLength": 20
                },
                "revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "document_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "payments": {
                  "maxItems": 5000,
                  "type": "array",
                  "items": {
                    "type": "string",
                    "maxLength": 64,
                    "pattern": "^-?(0|[1-9][0-9]*)(\\.[0-9]+)? [A-Z]{1,7}$"
                  }
                },
                "dues": {
                  "maxItems": 5000,
                  "type": "array",
                  "items": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  }
                },
                "term_start": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "term_end": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "status": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                },
                "consent_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "decision_doc": {
                  "type": "string",
                  "maxLength": 20
                },
                "decision_version": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "project_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "funding_ballot": {
                  "type": "string",
                  "maxLength": 20
                }
              },
              "required": [
                "id",
                "dao_id",
                "round_id",
                "contributor",
                "revision",
                "document_id",
                "document_version",
                "payments",
                "dues",
                "term_start",
                "term_end",
                "status",
                "consent_at",
                "decision_doc",
                "decision_version",
                "project_id",
                "funding_ballot"
              ],
              "additionalProperties": false
            }
          },
          "grantPlans": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "ballot_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "grants": {
                  "type": "string",
                  "maxLength": 13
                },
                "works": {
                  "type": "string",
                  "maxLength": 13
                },
                "round_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "application_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "application_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "project_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "grants_hash": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "works_hash": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "policy_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "deadline": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "executed": {
                  "type": "boolean"
                }
              },
              "required": [
                "ballot_id",
                "dao_id",
                "grants",
                "works",
                "round_id",
                "application_id",
                "application_revision",
                "project_id",
                "commitment",
                "grants_hash",
                "works_hash",
                "policy_revision",
                "deadline",
                "executed"
              ],
              "additionalProperties": false
            }
          },
          "executions": {
            "default": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "ballot_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "works": {
                  "type": "string",
                  "maxLength": 13
                },
                "project_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "works_hash": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "policy_revision": {
                  "type": "string",
                  "maxLength": 20
                },
                "deadline": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "executed": {
                  "type": "boolean"
                }
              },
              "required": [
                "ballot_id",
                "dao_id",
                "works",
                "project_id",
                "commitment",
                "works_hash",
                "policy_revision",
                "deadline",
                "executed"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "dao",
          "next",
          "modules",
          "activities",
          "activityReviews",
          "activityDecisions",
          "appKeys",
          "appKeyGrants",
          "ballots",
          "ballotDefinitions",
          "ballotTargets",
          "documentChanges",
          "arbitrationPlans",
          "protectedWorksTerms",
          "protectedGrantTerms",
          "votes",
          "projects",
          "milestones",
          "agreements",
          "schedules",
          "entries",
          "controls",
          "payrollTerms",
          "elections",
          "nominations",
          "terms",
          "joinApplications",
          "rounds",
          "applications",
          "grantPlans",
          "executions"
        ],
        "additionalProperties": false
      },
      "helpTopic": "module-reference"
    },
    {
      "method": "POST",
      "path": "/v1/decide/finalize",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "ballotId": {
            "type": "string",
            "maxLength": 20
          }
        },
        "required": [
          "dao",
          "ballotId"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "oneOf": [
          {
            "type": "object",
            "properties": {
              "state": {
                "type": "string",
                "const": "finalized"
              },
              "transactionId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              }
            },
            "required": [
              "state",
              "transactionId"
            ],
            "additionalProperties": false
          },
          {
            "type": "object",
            "properties": {
              "state": {
                "type": "string",
                "const": "already-finalized"
              }
            },
            "required": [
              "state"
            ],
            "additionalProperties": false
          }
        ]
      },
      "helpTopic": "decide"
    },
    {
      "method": "POST",
      "path": "/v1/decide/execute",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "ballotId": {
            "type": "string",
            "maxLength": 20
          }
        },
        "required": [
          "dao",
          "ballotId"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "oneOf": [
          {
            "type": "object",
            "properties": {
              "state": {
                "type": "string",
                "const": "executed"
              },
              "transactionId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              }
            },
            "required": [
              "state",
              "transactionId"
            ],
            "additionalProperties": false
          },
          {
            "type": "object",
            "properties": {
              "state": {
                "type": "string",
                "const": "already-executed"
              }
            },
            "required": [
              "state"
            ],
            "additionalProperties": false
          }
        ]
      },
      "helpTopic": "governed-funding"
    },
    {
      "method": "GET",
      "path": "/v1/archive/history",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "cursor": {
            "type": "string",
            "maxLength": 20
          }
        },
        "required": [
          "dao"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "anchors": {
            "maxItems": 20,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "dao_id": {
                  "type": "string",
                  "maxLength": 20
                },
                "manifest": {
                  "type": "object",
                  "properties": {
                    "format_version": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 65535
                    },
                    "chain_id": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "runtime": {
                      "type": "string",
                      "maxLength": 13
                    },
                    "dao_id": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "source": {
                      "type": "string",
                      "maxLength": 13
                    },
                    "code_hash": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "abi_hash": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "block_number": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 4294967295
                    },
                    "block_id": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "timestamp": {
                      "type": "string",
                      "maxLength": 16384
                    },
                    "families": {
                      "maxItems": 5000,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "kind": {
                            "type": "string",
                            "maxLength": 16384
                          },
                          "parent_id": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "table": {
                            "type": "string",
                            "maxLength": 13
                          },
                          "scope": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "schema_hash": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "records": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "chunks": {
                            "maxItems": 5000,
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "domain": {
                                  "type": "object",
                                  "properties": {
                                    "format_version": {
                                      "type": "integer",
                                      "minimum": 0,
                                      "maximum": 65535
                                    },
                                    "chain_id": {
                                      "type": "string",
                                      "pattern": "^[0-9a-f]{64}$"
                                    },
                                    "runtime": {
                                      "type": "string",
                                      "maxLength": 13
                                    },
                                    "dao_id": {
                                      "type": "string",
                                      "maxLength": 20
                                    },
                                    "source": {
                                      "type": "string",
                                      "maxLength": 13
                                    },
                                    "code_hash": {
                                      "type": "string",
                                      "pattern": "^[0-9a-f]{64}$"
                                    },
                                    "abi_hash": {
                                      "type": "string",
                                      "pattern": "^[0-9a-f]{64}$"
                                    },
                                    "schema_hash": {
                                      "type": "string",
                                      "pattern": "^[0-9a-f]{64}$"
                                    },
                                    "table": {
                                      "type": "string",
                                      "maxLength": 13
                                    },
                                    "scope": {
                                      "type": "string",
                                      "maxLength": 20
                                    },
                                    "chunk_ordinal": {
                                      "type": "integer",
                                      "minimum": 0,
                                      "maximum": 4294967295
                                    },
                                    "leaf_count": {
                                      "type": "integer",
                                      "minimum": 0,
                                      "maximum": 4294967295
                                    }
                                  },
                                  "required": [
                                    "format_version",
                                    "chain_id",
                                    "runtime",
                                    "dao_id",
                                    "source",
                                    "code_hash",
                                    "abi_hash",
                                    "schema_hash",
                                    "table",
                                    "scope",
                                    "chunk_ordinal",
                                    "leaf_count"
                                  ],
                                  "additionalProperties": false
                                },
                                "root": {
                                  "type": "string",
                                  "pattern": "^[0-9a-f]{64}$"
                                },
                                "cid": {
                                  "type": "string",
                                  "maxLength": 16384
                                },
                                "bytes": {
                                  "type": "integer",
                                  "minimum": 0,
                                  "maximum": 4294967295
                                },
                                "commitment": {
                                  "type": "string",
                                  "pattern": "^[0-9a-f]{64}$"
                                },
                                "first_key": {
                                  "type": "string",
                                  "maxLength": 20
                                },
                                "last_key": {
                                  "type": "string",
                                  "maxLength": 20
                                }
                              },
                              "required": [
                                "domain",
                                "root",
                                "cid",
                                "bytes",
                                "commitment",
                                "first_key",
                                "last_key"
                              ],
                              "additionalProperties": false
                            }
                          }
                        },
                        "required": [
                          "kind",
                          "parent_id",
                          "table",
                          "scope",
                          "schema_hash",
                          "records",
                          "chunks"
                        ],
                        "additionalProperties": false
                      }
                    },
                    "files": {
                      "maxItems": 5000,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "document_id": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "version": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          },
                          "cid": {
                            "type": "string",
                            "maxLength": 16384
                          },
                          "bytes": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "commitment": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "envelope_version": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 255
                          },
                          "key_epoch": {
                            "type": "string",
                            "maxLength": 20
                          }
                        },
                        "required": [
                          "document_id",
                          "version",
                          "cid",
                          "bytes",
                          "commitment",
                          "envelope_version",
                          "key_epoch"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "format_version",
                    "chain_id",
                    "runtime",
                    "dao_id",
                    "source",
                    "code_hash",
                    "abi_hash",
                    "block_number",
                    "block_id",
                    "timestamp",
                    "families",
                    "files"
                  ],
                  "additionalProperties": false
                },
                "manifest_cid": {
                  "type": "string",
                  "maxLength": 16384
                },
                "manifest_bytes": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "manifest_commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "descriptor_commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "backup_commitment": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "verifier": {
                  "type": "string",
                  "maxLength": 13
                },
                "attestation_transaction": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "approval_transaction": {
                  "type": "string",
                  "pattern": "^[0-9a-f]{64}$"
                },
                "retention_seconds": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "attested_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "approved_by": {
                  "type": "string",
                  "maxLength": 20
                },
                "approved_at": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "revoked": {
                  "type": "boolean"
                }
              },
              "required": [
                "id",
                "dao_id",
                "manifest",
                "manifest_cid",
                "manifest_bytes",
                "manifest_commitment",
                "descriptor_commitment",
                "backup_commitment",
                "verifier",
                "attestation_transaction",
                "approval_transaction",
                "retention_seconds",
                "attested_at",
                "approved_by",
                "approved_at",
                "revoked"
              ],
              "additionalProperties": false
            }
          },
          "next": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "dao",
          "anchors",
          "next"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/history/recover",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "manifestCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          }
        },
        "required": [
          "dao",
          "manifestCommitment"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
          "manifest": {
            "type": "object",
            "properties": {
              "schemaVersion": {
                "type": "number",
                "const": 1
              },
              "dao": {
                "type": "object",
                "properties": {
                  "chainId": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "contract": {
                    "type": "string",
                    "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                  },
                  "daoId": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "interfaceVersion": {
                    "type": "number",
                    "const": 1
                  }
                },
                "required": [
                  "chainId",
                  "contract",
                  "daoId",
                  "interfaceVersion"
                ],
                "additionalProperties": false
              },
              "snapshot": {
                "type": "object",
                "properties": {
                  "blockNumber": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 4294967295
                  },
                  "blockId": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "timestamp": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "blockNumber",
                  "blockId",
                  "timestamp"
                ],
                "additionalProperties": false
              },
              "source": {
                "type": "object",
                "properties": {
                  "account": {
                    "type": "string",
                    "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                  },
                  "codeHash": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "abiHash": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "account",
                  "codeHash",
                  "abiHash"
                ],
                "additionalProperties": false
              },
              "families": {
                "minItems": 1,
                "maxItems": 64,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "kind": {
                      "type": "string",
                      "enum": [
                        "ordinary-poll-votes",
                        "document-versions",
                        "quick-ballot-responses",
                        "quick-ballot-grants",
                        "protected-export"
                      ]
                    },
                    "parentId": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "table": {
                      "type": "string",
                      "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                    },
                    "scope": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "schemaHash": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "records": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "chunks": {
                      "maxItems": 1024,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "domain": {
                            "type": "object",
                            "properties": {
                              "format_version": {
                                "type": "number",
                                "const": 1
                              },
                              "chain_id": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "runtime": {
                                "type": "string",
                                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                              },
                              "dao_id": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "source": {
                                "type": "string",
                                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                              },
                              "code_hash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "abi_hash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "schema_hash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "table": {
                                "type": "string",
                                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                              },
                              "scope": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "chunk_ordinal": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 4294967295
                              },
                              "leaf_count": {
                                "type": "integer",
                                "minimum": 1,
                                "maximum": 65536
                              }
                            },
                            "required": [
                              "format_version",
                              "chain_id",
                              "runtime",
                              "dao_id",
                              "source",
                              "code_hash",
                              "abi_hash",
                              "schema_hash",
                              "table",
                              "scope",
                              "chunk_ordinal",
                              "leaf_count"
                            ],
                            "additionalProperties": false
                          },
                          "root": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "cid": {
                            "type": "string",
                            "maxLength": 128
                          },
                          "bytes": {
                            "type": "integer",
                            "minimum": 188,
                            "maximum": 5242880
                          },
                          "commitment": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "firstKey": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "lastKey": {
                            "type": "string",
                            "maxLength": 20
                          }
                        },
                        "required": [
                          "domain",
                          "root",
                          "cid",
                          "bytes",
                          "commitment",
                          "firstKey",
                          "lastKey"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "kind",
                    "parentId",
                    "table",
                    "scope",
                    "schemaHash",
                    "records",
                    "chunks"
                  ],
                  "additionalProperties": false
                }
              },
              "files": {
                "maxItems": 65536,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "document_id": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "version": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4294967295
                    },
                    "cid": {
                      "type": "string",
                      "maxLength": 128
                    },
                    "bytes": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "envelope_version": {
                      "anyOf": [
                        {
                          "type": "number",
                          "const": 0
                        },
                        {
                          "type": "number",
                          "const": 1
                        }
                      ]
                    },
                    "key_epoch": {
                      "type": "string",
                      "maxLength": 20
                    }
                  },
                  "required": [
                    "document_id",
                    "version",
                    "cid",
                    "bytes",
                    "commitment",
                    "envelope_version",
                    "key_epoch"
                  ],
                  "additionalProperties": false
                }
              },
              "descriptorCommitment": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              }
            },
            "required": [
              "schemaVersion",
              "dao",
              "snapshot",
              "source",
              "families",
              "files",
              "descriptorCommitment"
            ],
            "additionalProperties": false
          },
          "manifestFile": {
            "type": "object",
            "properties": {
              "cid": {
                "type": "string",
                "maxLength": 128
              },
              "bytes": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5242880
              },
              "commitment": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "content": {
                "type": "string",
                "minLength": 4,
                "maxLength": 6990508
              }
            },
            "required": [
              "cid",
              "bytes",
              "commitment",
              "content"
            ],
            "additionalProperties": false
          },
          "chunks": {
            "maxItems": 1024,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "cid": {
                  "type": "string",
                  "maxLength": 128
                },
                "content": {
                  "type": "string",
                  "minLength": 4,
                  "maxLength": 6990508
                }
              },
              "required": [
                "cid",
                "content"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "id",
          "manifest",
          "manifestFile",
          "chunks"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/history/page",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "manifestCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "cursor": {
            "type": "string",
            "maxLength": 20
          }
        },
        "required": [
          "dao",
          "manifestCommitment"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "manifestCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "parentId": {
            "type": "string",
            "maxLength": 20
          },
          "records": {
            "maxItems": 25,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "maxLength": 20
                },
                "ballot": {
                  "type": "string",
                  "maxLength": 20
                },
                "member": {
                  "type": "string",
                  "maxLength": 20
                },
                "weight": {
                  "type": "string",
                  "maxLength": 20
                },
                "choice": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 255
                }
              },
              "required": [
                "id",
                "ballot",
                "member",
                "weight",
                "choice"
              ],
              "additionalProperties": false
            }
          },
          "next": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "null"
              }
            ]
          },
          "coverage": {
            "type": "string",
            "const": "verified-archive"
          },
          "liveRowsIncluded": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "dao",
          "manifestCommitment",
          "parentId",
          "records",
          "next",
          "coverage",
          "liveRowsIncluded"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/preview",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "anyOf": [
          {
            "type": "object",
            "properties": {
              "dao": {
                "type": "object",
                "properties": {
                  "chainId": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "contract": {
                    "type": "string",
                    "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                  },
                  "daoId": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "interfaceVersion": {
                    "type": "number",
                    "const": 1
                  }
                },
                "required": [
                  "chainId",
                  "contract",
                  "daoId",
                  "interfaceVersion"
                ],
                "additionalProperties": false
              },
              "ballotIds": {
                "minItems": 1,
                "maxItems": 64,
                "type": "array",
                "items": {
                  "type": "string",
                  "maxLength": 20
                }
              },
              "retentionSeconds": {
                "type": "integer",
                "minimum": 7776000,
                "maximum": 315360000
              }
            },
            "required": [
              "dao",
              "ballotIds",
              "retentionSeconds"
            ],
            "additionalProperties": false
          },
          {
            "type": "object",
            "properties": {
              "dao": {
                "type": "object",
                "properties": {
                  "chainId": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "contract": {
                    "type": "string",
                    "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                  },
                  "daoId": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "interfaceVersion": {
                    "type": "number",
                    "const": 1
                  }
                },
                "required": [
                  "chainId",
                  "contract",
                  "daoId",
                  "interfaceVersion"
                ],
                "additionalProperties": false
              },
              "documentRows": {
                "minItems": 1,
                "maxItems": 25,
                "type": "array",
                "items": {
                  "type": "string",
                  "maxLength": 20
                }
              },
              "retentionSeconds": {
                "type": "integer",
                "minimum": 7776000,
                "maximum": 315360000
              }
            },
            "required": [
              "dao",
              "documentRows",
              "retentionSeconds"
            ],
            "additionalProperties": false
          }
        ]
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "source": {
            "type": "object",
            "properties": {
              "account": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "codeHash": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "abiHash": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              }
            },
            "required": [
              "account",
              "codeHash",
              "abiHash"
            ],
            "additionalProperties": false
          },
          "snapshot": {
            "type": "object",
            "properties": {
              "blockNumber": {
                "type": "integer",
                "minimum": 1,
                "maximum": 4294967295
              },
              "blockId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "timestamp": {
                "anyOf": [
                  {
                    "type": "string",
                    "format": "date-time",
                    "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                  },
                  {
                    "type": "string",
                    "format": "date-time",
                    "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                  }
                ]
              }
            },
            "required": [
              "blockNumber",
              "blockId",
              "timestamp"
            ],
            "additionalProperties": false
          },
          "pruningAuthorized": {
            "type": "boolean",
            "const": false
          },
          "grossRamBytes": {
            "type": "string",
            "maxLength": 20
          },
          "blocked": {
            "maxItems": 64,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "parentId": {
                  "type": "string",
                  "maxLength": 20
                },
                "reason": {
                  "type": "string",
                  "enum": [
                    "protected-family",
                    "ballot-active",
                    "terminal-marker-required",
                    "terminal-not-irreversible",
                    "retention",
                    "reference-backfill-required",
                    "latest-version",
                    "referenced-version"
                  ]
                }
              },
              "required": [
                "parentId",
                "reason"
              ],
              "additionalProperties": false
            }
          },
          "families": {
            "maxItems": 64,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "kind": {
                  "type": "string",
                  "enum": [
                    "ordinary-poll-votes",
                    "document-versions",
                    "quick-ballot-responses",
                    "quick-ballot-grants"
                  ]
                },
                "parentId": {
                  "type": "string",
                  "maxLength": 20
                },
                "grossRamBytes": {
                  "type": "string",
                  "maxLength": 20
                },
                "chunks": {
                  "maxItems": 32,
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "domain": {
                        "type": "object",
                        "properties": {
                          "format_version": {
                            "type": "number",
                            "const": 1
                          },
                          "chain_id": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "runtime": {
                            "type": "string",
                            "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                          },
                          "dao_id": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "source": {
                            "type": "string",
                            "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                          },
                          "code_hash": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "abi_hash": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "schema_hash": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "table": {
                            "type": "string",
                            "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                          },
                          "scope": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "chunk_ordinal": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 4294967295
                          },
                          "leaf_count": {
                            "type": "integer",
                            "minimum": 1,
                            "maximum": 65536
                          }
                        },
                        "required": [
                          "format_version",
                          "chain_id",
                          "runtime",
                          "dao_id",
                          "source",
                          "code_hash",
                          "abi_hash",
                          "schema_hash",
                          "table",
                          "scope",
                          "chunk_ordinal",
                          "leaf_count"
                        ],
                        "additionalProperties": false
                      },
                      "root": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "bytes": {
                        "type": "integer",
                        "minimum": 188,
                        "maximum": 5242880
                      },
                      "rows": {
                        "minItems": 1,
                        "maxItems": 65536,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "primaryKey": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "packed": {
                              "type": "string",
                              "maxLength": 10485760,
                              "pattern": "^[0-9a-f]*$"
                            }
                          },
                          "required": [
                            "primaryKey",
                            "packed"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "domain",
                      "root",
                      "bytes",
                      "rows"
                    ],
                    "additionalProperties": false
                  }
                }
              },
              "required": [
                "kind",
                "parentId",
                "grossRamBytes",
                "chunks"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "dao",
          "source",
          "snapshot",
          "pruningAuthorized",
          "grossRamBytes",
          "blocked",
          "families"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/exports",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "requestId": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
          "selection": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "dao": {
                    "type": "object",
                    "properties": {
                      "chainId": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "contract": {
                        "type": "string",
                        "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                      },
                      "daoId": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "interfaceVersion": {
                        "type": "number",
                        "const": 1
                      }
                    },
                    "required": [
                      "chainId",
                      "contract",
                      "daoId",
                      "interfaceVersion"
                    ],
                    "additionalProperties": false
                  },
                  "ballotIds": {
                    "minItems": 1,
                    "maxItems": 64,
                    "type": "array",
                    "items": {
                      "type": "string",
                      "maxLength": 20
                    }
                  },
                  "retentionSeconds": {
                    "type": "integer",
                    "minimum": 7776000,
                    "maximum": 315360000
                  }
                },
                "required": [
                  "dao",
                  "ballotIds",
                  "retentionSeconds"
                ],
                "additionalProperties": false
              },
              {
                "type": "object",
                "properties": {
                  "dao": {
                    "type": "object",
                    "properties": {
                      "chainId": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "contract": {
                        "type": "string",
                        "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                      },
                      "daoId": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "interfaceVersion": {
                        "type": "number",
                        "const": 1
                      }
                    },
                    "required": [
                      "chainId",
                      "contract",
                      "daoId",
                      "interfaceVersion"
                    ],
                    "additionalProperties": false
                  },
                  "documentRows": {
                    "minItems": 1,
                    "maxItems": 25,
                    "type": "array",
                    "items": {
                      "type": "string",
                      "maxLength": 20
                    }
                  },
                  "retentionSeconds": {
                    "type": "integer",
                    "minimum": 7776000,
                    "maximum": 315360000
                  }
                },
                "required": [
                  "dao",
                  "documentRows",
                  "retentionSeconds"
                ],
                "additionalProperties": false
              }
            ]
          },
          "selectionCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          }
        },
        "required": [
          "requestId",
          "selection",
          "selectionCommitment",
          "maximumStoredBytes"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "state": {
            "type": "string",
            "enum": [
              "planned",
              "exporting",
              "pinned",
              "verified",
              "approved",
              "pruning",
              "completed",
              "failed",
              "review"
            ]
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          },
          "heldBytes": {
            "type": "string",
            "maxLength": 20
          },
          "verifiedChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "totalChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "manifest": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "cid": {
                    "type": "string",
                    "maxLength": 128
                  },
                  "bytes": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5242880
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "cid",
                  "bytes",
                  "commitment"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "retentionSeconds": {
            "default": 7776000,
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          },
          "anchor": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "dao_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "manifest": {
                    "type": "object",
                    "properties": {
                      "format_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "chain_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "runtime": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "source": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "code_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "abi_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "block_number": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "block_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "timestamp": {
                        "type": "string",
                        "maxLength": 16384
                      },
                      "families": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "kind": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "parent_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "table": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "scope": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "schema_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "records": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "chunks": {
                              "maxItems": 5000,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "domain": {
                                    "type": "object",
                                    "properties": {
                                      "format_version": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 65535
                                      },
                                      "chain_id": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "runtime": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "dao_id": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "source": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "code_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "abi_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "schema_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "table": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "scope": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "chunk_ordinal": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      },
                                      "leaf_count": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      }
                                    },
                                    "required": [
                                      "format_version",
                                      "chain_id",
                                      "runtime",
                                      "dao_id",
                                      "source",
                                      "code_hash",
                                      "abi_hash",
                                      "schema_hash",
                                      "table",
                                      "scope",
                                      "chunk_ordinal",
                                      "leaf_count"
                                    ],
                                    "additionalProperties": false
                                  },
                                  "root": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "first_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "last_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "domain",
                                  "root",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "first_key",
                                  "last_key"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "kind",
                            "parent_id",
                            "table",
                            "scope",
                            "schema_hash",
                            "records",
                            "chunks"
                          ],
                          "additionalProperties": false
                        }
                      },
                      "files": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "document_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "cid": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "bytes": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "commitment": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "envelope_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "key_epoch": {
                              "type": "string",
                              "maxLength": 20
                            }
                          },
                          "required": [
                            "document_id",
                            "version",
                            "cid",
                            "bytes",
                            "commitment",
                            "envelope_version",
                            "key_epoch"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "format_version",
                      "chain_id",
                      "runtime",
                      "dao_id",
                      "source",
                      "code_hash",
                      "abi_hash",
                      "block_number",
                      "block_id",
                      "timestamp",
                      "families",
                      "files"
                    ],
                    "additionalProperties": false
                  },
                  "manifest_cid": {
                    "type": "string",
                    "maxLength": 16384
                  },
                  "manifest_bytes": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "manifest_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "descriptor_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "backup_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "verifier": {
                    "type": "string",
                    "maxLength": 13
                  },
                  "attestation_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "approval_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "retention_seconds": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "attested_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "approved_by": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "approved_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "revoked": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "manifest",
                  "manifest_cid",
                  "manifest_bytes",
                  "manifest_commitment",
                  "descriptor_commitment",
                  "backup_commitment",
                  "verifier",
                  "attestation_transaction",
                  "approval_transaction",
                  "retention_seconds",
                  "attested_at",
                  "approved_by",
                  "approved_at",
                  "revoked"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backup": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "formatVersion": {
                    "type": "number",
                    "const": 1
                  },
                  "storeId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "keyId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "manifestCommitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "bytes": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "verifiedAt": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "formatVersion",
                  "storeId",
                  "keyId",
                  "commitment",
                  "manifestCommitment",
                  "bytes",
                  "verifiedAt"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backupSupported": {
            "default": false,
            "type": "boolean"
          },
          "pruningAuthorized": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "dao",
          "state",
          "maximumStoredBytes",
          "heldBytes",
          "verifiedChunks",
          "totalChunks",
          "manifest",
          "retentionSeconds",
          "anchor",
          "backup",
          "backupSupported",
          "pruningAuthorized"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "GET",
      "path": "/v1/archive/exports/:id",
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "state": {
            "type": "string",
            "enum": [
              "planned",
              "exporting",
              "pinned",
              "verified",
              "approved",
              "pruning",
              "completed",
              "failed",
              "review"
            ]
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          },
          "heldBytes": {
            "type": "string",
            "maxLength": 20
          },
          "verifiedChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "totalChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "manifest": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "cid": {
                    "type": "string",
                    "maxLength": 128
                  },
                  "bytes": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5242880
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "cid",
                  "bytes",
                  "commitment"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "retentionSeconds": {
            "default": 7776000,
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          },
          "anchor": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "dao_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "manifest": {
                    "type": "object",
                    "properties": {
                      "format_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "chain_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "runtime": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "source": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "code_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "abi_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "block_number": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "block_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "timestamp": {
                        "type": "string",
                        "maxLength": 16384
                      },
                      "families": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "kind": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "parent_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "table": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "scope": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "schema_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "records": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "chunks": {
                              "maxItems": 5000,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "domain": {
                                    "type": "object",
                                    "properties": {
                                      "format_version": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 65535
                                      },
                                      "chain_id": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "runtime": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "dao_id": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "source": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "code_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "abi_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "schema_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "table": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "scope": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "chunk_ordinal": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      },
                                      "leaf_count": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      }
                                    },
                                    "required": [
                                      "format_version",
                                      "chain_id",
                                      "runtime",
                                      "dao_id",
                                      "source",
                                      "code_hash",
                                      "abi_hash",
                                      "schema_hash",
                                      "table",
                                      "scope",
                                      "chunk_ordinal",
                                      "leaf_count"
                                    ],
                                    "additionalProperties": false
                                  },
                                  "root": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "first_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "last_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "domain",
                                  "root",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "first_key",
                                  "last_key"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "kind",
                            "parent_id",
                            "table",
                            "scope",
                            "schema_hash",
                            "records",
                            "chunks"
                          ],
                          "additionalProperties": false
                        }
                      },
                      "files": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "document_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "cid": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "bytes": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "commitment": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "envelope_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "key_epoch": {
                              "type": "string",
                              "maxLength": 20
                            }
                          },
                          "required": [
                            "document_id",
                            "version",
                            "cid",
                            "bytes",
                            "commitment",
                            "envelope_version",
                            "key_epoch"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "format_version",
                      "chain_id",
                      "runtime",
                      "dao_id",
                      "source",
                      "code_hash",
                      "abi_hash",
                      "block_number",
                      "block_id",
                      "timestamp",
                      "families",
                      "files"
                    ],
                    "additionalProperties": false
                  },
                  "manifest_cid": {
                    "type": "string",
                    "maxLength": 16384
                  },
                  "manifest_bytes": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "manifest_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "descriptor_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "backup_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "verifier": {
                    "type": "string",
                    "maxLength": 13
                  },
                  "attestation_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "approval_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "retention_seconds": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "attested_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "approved_by": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "approved_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "revoked": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "manifest",
                  "manifest_cid",
                  "manifest_bytes",
                  "manifest_commitment",
                  "descriptor_commitment",
                  "backup_commitment",
                  "verifier",
                  "attestation_transaction",
                  "approval_transaction",
                  "retention_seconds",
                  "attested_at",
                  "approved_by",
                  "approved_at",
                  "revoked"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backup": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "formatVersion": {
                    "type": "number",
                    "const": 1
                  },
                  "storeId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "keyId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "manifestCommitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "bytes": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "verifiedAt": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "formatVersion",
                  "storeId",
                  "keyId",
                  "commitment",
                  "manifestCommitment",
                  "bytes",
                  "verifiedAt"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backupSupported": {
            "default": false,
            "type": "boolean"
          },
          "pruningAuthorized": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "dao",
          "state",
          "maximumStoredBytes",
          "heldBytes",
          "verifiedChunks",
          "totalChunks",
          "manifest",
          "retentionSeconds",
          "anchor",
          "backup",
          "backupSupported",
          "pruningAuthorized"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/exports/:id/reconcile",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {},
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "state": {
            "type": "string",
            "enum": [
              "planned",
              "exporting",
              "pinned",
              "verified",
              "approved",
              "pruning",
              "completed",
              "failed",
              "review"
            ]
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          },
          "heldBytes": {
            "type": "string",
            "maxLength": 20
          },
          "verifiedChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "totalChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "manifest": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "cid": {
                    "type": "string",
                    "maxLength": 128
                  },
                  "bytes": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5242880
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "cid",
                  "bytes",
                  "commitment"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "retentionSeconds": {
            "default": 7776000,
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          },
          "anchor": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "dao_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "manifest": {
                    "type": "object",
                    "properties": {
                      "format_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "chain_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "runtime": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "source": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "code_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "abi_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "block_number": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "block_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "timestamp": {
                        "type": "string",
                        "maxLength": 16384
                      },
                      "families": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "kind": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "parent_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "table": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "scope": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "schema_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "records": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "chunks": {
                              "maxItems": 5000,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "domain": {
                                    "type": "object",
                                    "properties": {
                                      "format_version": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 65535
                                      },
                                      "chain_id": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "runtime": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "dao_id": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "source": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "code_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "abi_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "schema_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "table": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "scope": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "chunk_ordinal": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      },
                                      "leaf_count": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      }
                                    },
                                    "required": [
                                      "format_version",
                                      "chain_id",
                                      "runtime",
                                      "dao_id",
                                      "source",
                                      "code_hash",
                                      "abi_hash",
                                      "schema_hash",
                                      "table",
                                      "scope",
                                      "chunk_ordinal",
                                      "leaf_count"
                                    ],
                                    "additionalProperties": false
                                  },
                                  "root": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "first_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "last_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "domain",
                                  "root",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "first_key",
                                  "last_key"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "kind",
                            "parent_id",
                            "table",
                            "scope",
                            "schema_hash",
                            "records",
                            "chunks"
                          ],
                          "additionalProperties": false
                        }
                      },
                      "files": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "document_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "cid": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "bytes": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "commitment": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "envelope_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "key_epoch": {
                              "type": "string",
                              "maxLength": 20
                            }
                          },
                          "required": [
                            "document_id",
                            "version",
                            "cid",
                            "bytes",
                            "commitment",
                            "envelope_version",
                            "key_epoch"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "format_version",
                      "chain_id",
                      "runtime",
                      "dao_id",
                      "source",
                      "code_hash",
                      "abi_hash",
                      "block_number",
                      "block_id",
                      "timestamp",
                      "families",
                      "files"
                    ],
                    "additionalProperties": false
                  },
                  "manifest_cid": {
                    "type": "string",
                    "maxLength": 16384
                  },
                  "manifest_bytes": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "manifest_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "descriptor_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "backup_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "verifier": {
                    "type": "string",
                    "maxLength": 13
                  },
                  "attestation_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "approval_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "retention_seconds": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "attested_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "approved_by": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "approved_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "revoked": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "manifest",
                  "manifest_cid",
                  "manifest_bytes",
                  "manifest_commitment",
                  "descriptor_commitment",
                  "backup_commitment",
                  "verifier",
                  "attestation_transaction",
                  "approval_transaction",
                  "retention_seconds",
                  "attested_at",
                  "approved_by",
                  "approved_at",
                  "revoked"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backup": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "formatVersion": {
                    "type": "number",
                    "const": 1
                  },
                  "storeId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "keyId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "manifestCommitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "bytes": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "verifiedAt": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "formatVersion",
                  "storeId",
                  "keyId",
                  "commitment",
                  "manifestCommitment",
                  "bytes",
                  "verifiedAt"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backupSupported": {
            "default": false,
            "type": "boolean"
          },
          "pruningAuthorized": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "dao",
          "state",
          "maximumStoredBytes",
          "heldBytes",
          "verifiedChunks",
          "totalChunks",
          "manifest",
          "retentionSeconds",
          "anchor",
          "backup",
          "backupSupported",
          "pruningAuthorized"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/exports/:id/attest",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "manifestCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "descriptorCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "backupCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          },
          "retentionSeconds": {
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          }
        },
        "required": [
          "manifestCommitment",
          "descriptorCommitment",
          "backupCommitment",
          "retentionSeconds"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "state": {
            "type": "string",
            "enum": [
              "planned",
              "exporting",
              "pinned",
              "verified",
              "approved",
              "pruning",
              "completed",
              "failed",
              "review"
            ]
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          },
          "heldBytes": {
            "type": "string",
            "maxLength": 20
          },
          "verifiedChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "totalChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "manifest": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "cid": {
                    "type": "string",
                    "maxLength": 128
                  },
                  "bytes": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5242880
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "cid",
                  "bytes",
                  "commitment"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "retentionSeconds": {
            "default": 7776000,
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          },
          "anchor": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "dao_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "manifest": {
                    "type": "object",
                    "properties": {
                      "format_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "chain_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "runtime": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "source": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "code_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "abi_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "block_number": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "block_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "timestamp": {
                        "type": "string",
                        "maxLength": 16384
                      },
                      "families": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "kind": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "parent_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "table": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "scope": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "schema_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "records": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "chunks": {
                              "maxItems": 5000,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "domain": {
                                    "type": "object",
                                    "properties": {
                                      "format_version": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 65535
                                      },
                                      "chain_id": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "runtime": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "dao_id": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "source": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "code_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "abi_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "schema_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "table": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "scope": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "chunk_ordinal": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      },
                                      "leaf_count": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      }
                                    },
                                    "required": [
                                      "format_version",
                                      "chain_id",
                                      "runtime",
                                      "dao_id",
                                      "source",
                                      "code_hash",
                                      "abi_hash",
                                      "schema_hash",
                                      "table",
                                      "scope",
                                      "chunk_ordinal",
                                      "leaf_count"
                                    ],
                                    "additionalProperties": false
                                  },
                                  "root": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "first_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "last_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "domain",
                                  "root",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "first_key",
                                  "last_key"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "kind",
                            "parent_id",
                            "table",
                            "scope",
                            "schema_hash",
                            "records",
                            "chunks"
                          ],
                          "additionalProperties": false
                        }
                      },
                      "files": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "document_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "cid": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "bytes": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "commitment": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "envelope_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "key_epoch": {
                              "type": "string",
                              "maxLength": 20
                            }
                          },
                          "required": [
                            "document_id",
                            "version",
                            "cid",
                            "bytes",
                            "commitment",
                            "envelope_version",
                            "key_epoch"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "format_version",
                      "chain_id",
                      "runtime",
                      "dao_id",
                      "source",
                      "code_hash",
                      "abi_hash",
                      "block_number",
                      "block_id",
                      "timestamp",
                      "families",
                      "files"
                    ],
                    "additionalProperties": false
                  },
                  "manifest_cid": {
                    "type": "string",
                    "maxLength": 16384
                  },
                  "manifest_bytes": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "manifest_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "descriptor_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "backup_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "verifier": {
                    "type": "string",
                    "maxLength": 13
                  },
                  "attestation_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "approval_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "retention_seconds": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "attested_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "approved_by": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "approved_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "revoked": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "manifest",
                  "manifest_cid",
                  "manifest_bytes",
                  "manifest_commitment",
                  "descriptor_commitment",
                  "backup_commitment",
                  "verifier",
                  "attestation_transaction",
                  "approval_transaction",
                  "retention_seconds",
                  "attested_at",
                  "approved_by",
                  "approved_at",
                  "revoked"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backup": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "formatVersion": {
                    "type": "number",
                    "const": 1
                  },
                  "storeId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "keyId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "manifestCommitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "bytes": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "verifiedAt": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "formatVersion",
                  "storeId",
                  "keyId",
                  "commitment",
                  "manifestCommitment",
                  "bytes",
                  "verifiedAt"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backupSupported": {
            "default": false,
            "type": "boolean"
          },
          "pruningAuthorized": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "dao",
          "state",
          "maximumStoredBytes",
          "heldBytes",
          "verifiedChunks",
          "totalChunks",
          "manifest",
          "retentionSeconds",
          "anchor",
          "backup",
          "backupSupported",
          "pruningAuthorized"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/exports/:id/backup",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "expectedManifestCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          }
        },
        "required": [
          "expectedManifestCommitment"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "state": {
            "type": "string",
            "enum": [
              "planned",
              "exporting",
              "pinned",
              "verified",
              "approved",
              "pruning",
              "completed",
              "failed",
              "review"
            ]
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          },
          "heldBytes": {
            "type": "string",
            "maxLength": 20
          },
          "verifiedChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "totalChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "manifest": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "cid": {
                    "type": "string",
                    "maxLength": 128
                  },
                  "bytes": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5242880
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "cid",
                  "bytes",
                  "commitment"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "retentionSeconds": {
            "default": 7776000,
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          },
          "anchor": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "dao_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "manifest": {
                    "type": "object",
                    "properties": {
                      "format_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "chain_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "runtime": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "source": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "code_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "abi_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "block_number": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "block_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "timestamp": {
                        "type": "string",
                        "maxLength": 16384
                      },
                      "families": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "kind": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "parent_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "table": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "scope": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "schema_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "records": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "chunks": {
                              "maxItems": 5000,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "domain": {
                                    "type": "object",
                                    "properties": {
                                      "format_version": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 65535
                                      },
                                      "chain_id": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "runtime": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "dao_id": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "source": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "code_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "abi_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "schema_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "table": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "scope": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "chunk_ordinal": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      },
                                      "leaf_count": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      }
                                    },
                                    "required": [
                                      "format_version",
                                      "chain_id",
                                      "runtime",
                                      "dao_id",
                                      "source",
                                      "code_hash",
                                      "abi_hash",
                                      "schema_hash",
                                      "table",
                                      "scope",
                                      "chunk_ordinal",
                                      "leaf_count"
                                    ],
                                    "additionalProperties": false
                                  },
                                  "root": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "first_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "last_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "domain",
                                  "root",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "first_key",
                                  "last_key"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "kind",
                            "parent_id",
                            "table",
                            "scope",
                            "schema_hash",
                            "records",
                            "chunks"
                          ],
                          "additionalProperties": false
                        }
                      },
                      "files": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "document_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "cid": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "bytes": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "commitment": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "envelope_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "key_epoch": {
                              "type": "string",
                              "maxLength": 20
                            }
                          },
                          "required": [
                            "document_id",
                            "version",
                            "cid",
                            "bytes",
                            "commitment",
                            "envelope_version",
                            "key_epoch"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "format_version",
                      "chain_id",
                      "runtime",
                      "dao_id",
                      "source",
                      "code_hash",
                      "abi_hash",
                      "block_number",
                      "block_id",
                      "timestamp",
                      "families",
                      "files"
                    ],
                    "additionalProperties": false
                  },
                  "manifest_cid": {
                    "type": "string",
                    "maxLength": 16384
                  },
                  "manifest_bytes": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "manifest_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "descriptor_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "backup_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "verifier": {
                    "type": "string",
                    "maxLength": 13
                  },
                  "attestation_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "approval_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "retention_seconds": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "attested_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "approved_by": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "approved_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "revoked": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "manifest",
                  "manifest_cid",
                  "manifest_bytes",
                  "manifest_commitment",
                  "descriptor_commitment",
                  "backup_commitment",
                  "verifier",
                  "attestation_transaction",
                  "approval_transaction",
                  "retention_seconds",
                  "attested_at",
                  "approved_by",
                  "approved_at",
                  "revoked"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backup": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "formatVersion": {
                    "type": "number",
                    "const": 1
                  },
                  "storeId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "keyId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "manifestCommitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "bytes": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "verifiedAt": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "formatVersion",
                  "storeId",
                  "keyId",
                  "commitment",
                  "manifestCommitment",
                  "bytes",
                  "verifiedAt"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backupSupported": {
            "default": false,
            "type": "boolean"
          },
          "pruningAuthorized": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "dao",
          "state",
          "maximumStoredBytes",
          "heldBytes",
          "verifiedChunks",
          "totalChunks",
          "manifest",
          "retentionSeconds",
          "anchor",
          "backup",
          "backupSupported",
          "pruningAuthorized"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "GET",
      "path": "/v1/archive/exports/:id/bundle",
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
          "manifest": {
            "type": "object",
            "properties": {
              "schemaVersion": {
                "type": "number",
                "const": 1
              },
              "dao": {
                "type": "object",
                "properties": {
                  "chainId": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "contract": {
                    "type": "string",
                    "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                  },
                  "daoId": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "interfaceVersion": {
                    "type": "number",
                    "const": 1
                  }
                },
                "required": [
                  "chainId",
                  "contract",
                  "daoId",
                  "interfaceVersion"
                ],
                "additionalProperties": false
              },
              "snapshot": {
                "type": "object",
                "properties": {
                  "blockNumber": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 4294967295
                  },
                  "blockId": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "timestamp": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "blockNumber",
                  "blockId",
                  "timestamp"
                ],
                "additionalProperties": false
              },
              "source": {
                "type": "object",
                "properties": {
                  "account": {
                    "type": "string",
                    "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                  },
                  "codeHash": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "abiHash": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "account",
                  "codeHash",
                  "abiHash"
                ],
                "additionalProperties": false
              },
              "families": {
                "minItems": 1,
                "maxItems": 64,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "kind": {
                      "type": "string",
                      "enum": [
                        "ordinary-poll-votes",
                        "document-versions",
                        "quick-ballot-responses",
                        "quick-ballot-grants",
                        "protected-export"
                      ]
                    },
                    "parentId": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "table": {
                      "type": "string",
                      "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                    },
                    "scope": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "schemaHash": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "records": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "chunks": {
                      "maxItems": 1024,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "domain": {
                            "type": "object",
                            "properties": {
                              "format_version": {
                                "type": "number",
                                "const": 1
                              },
                              "chain_id": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "runtime": {
                                "type": "string",
                                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                              },
                              "dao_id": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "source": {
                                "type": "string",
                                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                              },
                              "code_hash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "abi_hash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "schema_hash": {
                                "type": "string",
                                "pattern": "^[0-9a-f]{64}$"
                              },
                              "table": {
                                "type": "string",
                                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                              },
                              "scope": {
                                "type": "string",
                                "maxLength": 20
                              },
                              "chunk_ordinal": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 4294967295
                              },
                              "leaf_count": {
                                "type": "integer",
                                "minimum": 1,
                                "maximum": 65536
                              }
                            },
                            "required": [
                              "format_version",
                              "chain_id",
                              "runtime",
                              "dao_id",
                              "source",
                              "code_hash",
                              "abi_hash",
                              "schema_hash",
                              "table",
                              "scope",
                              "chunk_ordinal",
                              "leaf_count"
                            ],
                            "additionalProperties": false
                          },
                          "root": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "cid": {
                            "type": "string",
                            "maxLength": 128
                          },
                          "bytes": {
                            "type": "integer",
                            "minimum": 188,
                            "maximum": 5242880
                          },
                          "commitment": {
                            "type": "string",
                            "pattern": "^[0-9a-f]{64}$"
                          },
                          "firstKey": {
                            "type": "string",
                            "maxLength": 20
                          },
                          "lastKey": {
                            "type": "string",
                            "maxLength": 20
                          }
                        },
                        "required": [
                          "domain",
                          "root",
                          "cid",
                          "bytes",
                          "commitment",
                          "firstKey",
                          "lastKey"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "kind",
                    "parentId",
                    "table",
                    "scope",
                    "schemaHash",
                    "records",
                    "chunks"
                  ],
                  "additionalProperties": false
                }
              },
              "files": {
                "maxItems": 65536,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "document_id": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "version": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4294967295
                    },
                    "cid": {
                      "type": "string",
                      "maxLength": 128
                    },
                    "bytes": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "commitment": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "envelope_version": {
                      "anyOf": [
                        {
                          "type": "number",
                          "const": 0
                        },
                        {
                          "type": "number",
                          "const": 1
                        }
                      ]
                    },
                    "key_epoch": {
                      "type": "string",
                      "maxLength": 20
                    }
                  },
                  "required": [
                    "document_id",
                    "version",
                    "cid",
                    "bytes",
                    "commitment",
                    "envelope_version",
                    "key_epoch"
                  ],
                  "additionalProperties": false
                }
              },
              "descriptorCommitment": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              }
            },
            "required": [
              "schemaVersion",
              "dao",
              "snapshot",
              "source",
              "families",
              "files",
              "descriptorCommitment"
            ],
            "additionalProperties": false
          },
          "manifestFile": {
            "type": "object",
            "properties": {
              "cid": {
                "type": "string",
                "maxLength": 128
              },
              "bytes": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5242880
              },
              "commitment": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "content": {
                "type": "string",
                "minLength": 4,
                "maxLength": 6990508
              }
            },
            "required": [
              "cid",
              "bytes",
              "commitment",
              "content"
            ],
            "additionalProperties": false
          },
          "chunks": {
            "maxItems": 1024,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "cid": {
                  "type": "string",
                  "maxLength": 128
                },
                "content": {
                  "type": "string",
                  "minLength": 4,
                  "maxLength": 6990508
                }
              },
              "required": [
                "cid",
                "content"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "id",
          "manifest",
          "manifestFile",
          "chunks"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "POST",
      "path": "/v1/archive/exports/:id/prune",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "expectedManifestCommitment": {
            "type": "string",
            "pattern": "^[0-9a-f]{64}$"
          }
        },
        "required": [
          "expectedManifestCommitment"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          },
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "state": {
            "type": "string",
            "enum": [
              "planned",
              "exporting",
              "pinned",
              "verified",
              "approved",
              "pruning",
              "completed",
              "failed",
              "review"
            ]
          },
          "maximumStoredBytes": {
            "type": "string",
            "maxLength": 20
          },
          "heldBytes": {
            "type": "string",
            "maxLength": 20
          },
          "verifiedChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "totalChunks": {
            "type": "integer",
            "minimum": 0,
            "maximum": 1024
          },
          "manifest": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "cid": {
                    "type": "string",
                    "maxLength": 128
                  },
                  "bytes": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5242880
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  }
                },
                "required": [
                  "cid",
                  "bytes",
                  "commitment"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "retentionSeconds": {
            "default": 7776000,
            "type": "integer",
            "minimum": 7776000,
            "maximum": 315360000
          },
          "anchor": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "dao_id": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "manifest": {
                    "type": "object",
                    "properties": {
                      "format_version": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 65535
                      },
                      "chain_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "runtime": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "dao_id": {
                        "type": "string",
                        "maxLength": 20
                      },
                      "source": {
                        "type": "string",
                        "maxLength": 13
                      },
                      "code_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "abi_hash": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "block_number": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 4294967295
                      },
                      "block_id": {
                        "type": "string",
                        "pattern": "^[0-9a-f]{64}$"
                      },
                      "timestamp": {
                        "type": "string",
                        "maxLength": 16384
                      },
                      "families": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "kind": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "parent_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "table": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "scope": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "schema_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "records": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "chunks": {
                              "maxItems": 5000,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "domain": {
                                    "type": "object",
                                    "properties": {
                                      "format_version": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 65535
                                      },
                                      "chain_id": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "runtime": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "dao_id": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "source": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "code_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "abi_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "schema_hash": {
                                        "type": "string",
                                        "pattern": "^[0-9a-f]{64}$"
                                      },
                                      "table": {
                                        "type": "string",
                                        "maxLength": 13
                                      },
                                      "scope": {
                                        "type": "string",
                                        "maxLength": 20
                                      },
                                      "chunk_ordinal": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      },
                                      "leaf_count": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 4294967295
                                      }
                                    },
                                    "required": [
                                      "format_version",
                                      "chain_id",
                                      "runtime",
                                      "dao_id",
                                      "source",
                                      "code_hash",
                                      "abi_hash",
                                      "schema_hash",
                                      "table",
                                      "scope",
                                      "chunk_ordinal",
                                      "leaf_count"
                                    ],
                                    "additionalProperties": false
                                  },
                                  "root": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "first_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "last_key": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "domain",
                                  "root",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "first_key",
                                  "last_key"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "kind",
                            "parent_id",
                            "table",
                            "scope",
                            "schema_hash",
                            "records",
                            "chunks"
                          ],
                          "additionalProperties": false
                        }
                      },
                      "files": {
                        "maxItems": 5000,
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "document_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "cid": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "bytes": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "commitment": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "envelope_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 255
                            },
                            "key_epoch": {
                              "type": "string",
                              "maxLength": 20
                            }
                          },
                          "required": [
                            "document_id",
                            "version",
                            "cid",
                            "bytes",
                            "commitment",
                            "envelope_version",
                            "key_epoch"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "format_version",
                      "chain_id",
                      "runtime",
                      "dao_id",
                      "source",
                      "code_hash",
                      "abi_hash",
                      "block_number",
                      "block_id",
                      "timestamp",
                      "families",
                      "files"
                    ],
                    "additionalProperties": false
                  },
                  "manifest_cid": {
                    "type": "string",
                    "maxLength": 16384
                  },
                  "manifest_bytes": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "manifest_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "descriptor_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "backup_commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "verifier": {
                    "type": "string",
                    "maxLength": 13
                  },
                  "attestation_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "approval_transaction": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "retention_seconds": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "attested_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "approved_by": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "approved_at": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 4294967295
                  },
                  "revoked": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "id",
                  "dao_id",
                  "manifest",
                  "manifest_cid",
                  "manifest_bytes",
                  "manifest_commitment",
                  "descriptor_commitment",
                  "backup_commitment",
                  "verifier",
                  "attestation_transaction",
                  "approval_transaction",
                  "retention_seconds",
                  "attested_at",
                  "approved_by",
                  "approved_at",
                  "revoked"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backup": {
            "default": null,
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "formatVersion": {
                    "type": "number",
                    "const": 1
                  },
                  "storeId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "keyId": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                  },
                  "commitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "manifestCommitment": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  "bytes": {
                    "type": "string",
                    "maxLength": 20
                  },
                  "verifiedAt": {
                    "anyOf": [
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                      },
                      {
                        "type": "string",
                        "format": "date-time",
                        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                      }
                    ]
                  }
                },
                "required": [
                  "formatVersion",
                  "storeId",
                  "keyId",
                  "commitment",
                  "manifestCommitment",
                  "bytes",
                  "verifiedAt"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "backupSupported": {
            "default": false,
            "type": "boolean"
          },
          "pruningAuthorized": {
            "default": false,
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "dao",
          "state",
          "maximumStoredBytes",
          "heldBytes",
          "verifiedChunks",
          "totalChunks",
          "manifest",
          "retentionSeconds",
          "anchor",
          "backup",
          "backupSupported",
          "pruningAuthorized"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "GET",
      "path": "/v1/archive/exports",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "cursor": {
            "type": "string",
            "format": "uuid",
            "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
          }
        },
        "required": [
          "dao"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "dao": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "contract": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "daoId": {
                "type": "string",
                "maxLength": 20
              },
              "interfaceVersion": {
                "type": "number",
                "const": 1
              }
            },
            "required": [
              "chainId",
              "contract",
              "daoId",
              "interfaceVersion"
            ],
            "additionalProperties": false
          },
          "exports": {
            "maxItems": 20,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "format": "uuid",
                  "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                },
                "dao": {
                  "type": "object",
                  "properties": {
                    "chainId": {
                      "type": "string",
                      "pattern": "^[0-9a-f]{64}$"
                    },
                    "contract": {
                      "type": "string",
                      "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                    },
                    "daoId": {
                      "type": "string",
                      "maxLength": 20
                    },
                    "interfaceVersion": {
                      "type": "number",
                      "const": 1
                    }
                  },
                  "required": [
                    "chainId",
                    "contract",
                    "daoId",
                    "interfaceVersion"
                  ],
                  "additionalProperties": false
                },
                "state": {
                  "type": "string",
                  "enum": [
                    "planned",
                    "exporting",
                    "pinned",
                    "verified",
                    "approved",
                    "pruning",
                    "completed",
                    "failed",
                    "review"
                  ]
                },
                "maximumStoredBytes": {
                  "type": "string",
                  "maxLength": 20
                },
                "heldBytes": {
                  "type": "string",
                  "maxLength": 20
                },
                "verifiedChunks": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 1024
                },
                "totalChunks": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 1024
                },
                "manifest": {
                  "anyOf": [
                    {
                      "type": "object",
                      "properties": {
                        "cid": {
                          "type": "string",
                          "maxLength": 128
                        },
                        "bytes": {
                          "type": "integer",
                          "minimum": 1,
                          "maximum": 5242880
                        },
                        "commitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        }
                      },
                      "required": [
                        "cid",
                        "bytes",
                        "commitment"
                      ],
                      "additionalProperties": false
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "retentionSeconds": {
                  "default": 7776000,
                  "type": "integer",
                  "minimum": 7776000,
                  "maximum": 315360000
                },
                "anchor": {
                  "default": null,
                  "anyOf": [
                    {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "dao_id": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "manifest": {
                          "type": "object",
                          "properties": {
                            "format_version": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 65535
                            },
                            "chain_id": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "runtime": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "dao_id": {
                              "type": "string",
                              "maxLength": 20
                            },
                            "source": {
                              "type": "string",
                              "maxLength": 13
                            },
                            "code_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "abi_hash": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "block_number": {
                              "type": "integer",
                              "minimum": 0,
                              "maximum": 4294967295
                            },
                            "block_id": {
                              "type": "string",
                              "pattern": "^[0-9a-f]{64}$"
                            },
                            "timestamp": {
                              "type": "string",
                              "maxLength": 16384
                            },
                            "families": {
                              "maxItems": 5000,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "kind": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "parent_id": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "table": {
                                    "type": "string",
                                    "maxLength": 13
                                  },
                                  "scope": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "schema_hash": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "records": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "chunks": {
                                    "maxItems": 5000,
                                    "type": "array",
                                    "items": {
                                      "type": "object",
                                      "properties": {
                                        "domain": {
                                          "type": "object",
                                          "properties": {
                                            "format_version": {
                                              "type": "integer",
                                              "minimum": 0,
                                              "maximum": 65535
                                            },
                                            "chain_id": {
                                              "type": "string",
                                              "pattern": "^[0-9a-f]{64}$"
                                            },
                                            "runtime": {
                                              "type": "string",
                                              "maxLength": 13
                                            },
                                            "dao_id": {
                                              "type": "string",
                                              "maxLength": 20
                                            },
                                            "source": {
                                              "type": "string",
                                              "maxLength": 13
                                            },
                                            "code_hash": {
                                              "type": "string",
                                              "pattern": "^[0-9a-f]{64}$"
                                            },
                                            "abi_hash": {
                                              "type": "string",
                                              "pattern": "^[0-9a-f]{64}$"
                                            },
                                            "schema_hash": {
                                              "type": "string",
                                              "pattern": "^[0-9a-f]{64}$"
                                            },
                                            "table": {
                                              "type": "string",
                                              "maxLength": 13
                                            },
                                            "scope": {
                                              "type": "string",
                                              "maxLength": 20
                                            },
                                            "chunk_ordinal": {
                                              "type": "integer",
                                              "minimum": 0,
                                              "maximum": 4294967295
                                            },
                                            "leaf_count": {
                                              "type": "integer",
                                              "minimum": 0,
                                              "maximum": 4294967295
                                            }
                                          },
                                          "required": [
                                            "format_version",
                                            "chain_id",
                                            "runtime",
                                            "dao_id",
                                            "source",
                                            "code_hash",
                                            "abi_hash",
                                            "schema_hash",
                                            "table",
                                            "scope",
                                            "chunk_ordinal",
                                            "leaf_count"
                                          ],
                                          "additionalProperties": false
                                        },
                                        "root": {
                                          "type": "string",
                                          "pattern": "^[0-9a-f]{64}$"
                                        },
                                        "cid": {
                                          "type": "string",
                                          "maxLength": 16384
                                        },
                                        "bytes": {
                                          "type": "integer",
                                          "minimum": 0,
                                          "maximum": 4294967295
                                        },
                                        "commitment": {
                                          "type": "string",
                                          "pattern": "^[0-9a-f]{64}$"
                                        },
                                        "first_key": {
                                          "type": "string",
                                          "maxLength": 20
                                        },
                                        "last_key": {
                                          "type": "string",
                                          "maxLength": 20
                                        }
                                      },
                                      "required": [
                                        "domain",
                                        "root",
                                        "cid",
                                        "bytes",
                                        "commitment",
                                        "first_key",
                                        "last_key"
                                      ],
                                      "additionalProperties": false
                                    }
                                  }
                                },
                                "required": [
                                  "kind",
                                  "parent_id",
                                  "table",
                                  "scope",
                                  "schema_hash",
                                  "records",
                                  "chunks"
                                ],
                                "additionalProperties": false
                              }
                            },
                            "files": {
                              "maxItems": 5000,
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "document_id": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "version": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 4294967295
                                  },
                                  "cid": {
                                    "type": "string",
                                    "maxLength": 16384
                                  },
                                  "bytes": {
                                    "type": "string",
                                    "maxLength": 20
                                  },
                                  "commitment": {
                                    "type": "string",
                                    "pattern": "^[0-9a-f]{64}$"
                                  },
                                  "envelope_version": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 255
                                  },
                                  "key_epoch": {
                                    "type": "string",
                                    "maxLength": 20
                                  }
                                },
                                "required": [
                                  "document_id",
                                  "version",
                                  "cid",
                                  "bytes",
                                  "commitment",
                                  "envelope_version",
                                  "key_epoch"
                                ],
                                "additionalProperties": false
                              }
                            }
                          },
                          "required": [
                            "format_version",
                            "chain_id",
                            "runtime",
                            "dao_id",
                            "source",
                            "code_hash",
                            "abi_hash",
                            "block_number",
                            "block_id",
                            "timestamp",
                            "families",
                            "files"
                          ],
                          "additionalProperties": false
                        },
                        "manifest_cid": {
                          "type": "string",
                          "maxLength": 16384
                        },
                        "manifest_bytes": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "manifest_commitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "descriptor_commitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "backup_commitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "verifier": {
                          "type": "string",
                          "maxLength": 13
                        },
                        "attestation_transaction": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "approval_transaction": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "retention_seconds": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "attested_at": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "approved_by": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "approved_at": {
                          "type": "integer",
                          "minimum": 0,
                          "maximum": 4294967295
                        },
                        "revoked": {
                          "type": "boolean"
                        }
                      },
                      "required": [
                        "id",
                        "dao_id",
                        "manifest",
                        "manifest_cid",
                        "manifest_bytes",
                        "manifest_commitment",
                        "descriptor_commitment",
                        "backup_commitment",
                        "verifier",
                        "attestation_transaction",
                        "approval_transaction",
                        "retention_seconds",
                        "attested_at",
                        "approved_by",
                        "approved_at",
                        "revoked"
                      ],
                      "additionalProperties": false
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "backup": {
                  "default": null,
                  "anyOf": [
                    {
                      "type": "object",
                      "properties": {
                        "formatVersion": {
                          "type": "number",
                          "const": 1
                        },
                        "storeId": {
                          "type": "string",
                          "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                        },
                        "keyId": {
                          "type": "string",
                          "pattern": "^[A-Za-z0-9_.:-]{1,128}$"
                        },
                        "commitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "manifestCommitment": {
                          "type": "string",
                          "pattern": "^[0-9a-f]{64}$"
                        },
                        "bytes": {
                          "type": "string",
                          "maxLength": 20
                        },
                        "verifiedAt": {
                          "anyOf": [
                            {
                              "type": "string",
                              "format": "date-time",
                              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z))$"
                            },
                            {
                              "type": "string",
                              "format": "date-time",
                              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}(?:Z))$"
                            }
                          ]
                        }
                      },
                      "required": [
                        "formatVersion",
                        "storeId",
                        "keyId",
                        "commitment",
                        "manifestCommitment",
                        "bytes",
                        "verifiedAt"
                      ],
                      "additionalProperties": false
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "backupSupported": {
                  "default": false,
                  "type": "boolean"
                },
                "pruningAuthorized": {
                  "default": false,
                  "type": "boolean"
                }
              },
              "required": [
                "id",
                "dao",
                "state",
                "maximumStoredBytes",
                "heldBytes",
                "verifiedChunks",
                "totalChunks",
                "manifest",
                "retentionSeconds",
                "anchor",
                "backup",
                "backupSupported",
                "pruningAuthorized"
              ],
              "additionalProperties": false
            }
          },
          "next": {
            "anyOf": [
              {
                "type": "string",
                "format": "uuid",
                "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "dao",
          "exports",
          "next"
        ],
        "additionalProperties": false
      },
      "helpTopic": "archive"
    },
    {
      "method": "GET",
      "path": "/v1/telos/ballots",
      "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "cursor": {
            "type": "string",
            "maxLength": 20
          },
          "kind": {
            "type": "string",
            "enum": [
              "ballots",
              "elections",
              "foundation"
            ]
          }
        },
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "source": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "rpcUrl": {
                "type": "string",
                "maxLength": 512,
                "format": "uri"
              },
              "contract": {
                "type": "string",
                "const": "telos.decide"
              },
              "environment": {
                "type": "string",
                "enum": [
                  "local",
                  "testnet",
                  "mainnet"
                ]
              },
              "codeHash": {
                "anyOf": [
                  {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "abiHash": {
                "anyOf": [
                  {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            },
            "required": [
              "chainId",
              "rpcUrl",
              "contract",
              "environment",
              "codeHash",
              "abiHash"
            ],
            "additionalProperties": false
          },
          "ballots": {
            "maxItems": 25,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "ballot_name": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 13,
                  "pattern": "^[a-z1-5.]*$"
                },
                "category": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 13,
                  "pattern": "^[a-z1-5.]*$"
                },
                "publisher": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 13,
                  "pattern": "^[a-z1-5.]*$"
                },
                "status": {
                  "type": "string",
                  "enum": [
                    "setup",
                    "voting",
                    "closed",
                    "cancelled",
                    "archived"
                  ]
                },
                "title": {
                  "type": "string",
                  "maxLength": 4096
                },
                "description": {
                  "type": "string",
                  "maxLength": 4096
                },
                "content": {
                  "type": "string",
                  "maxLength": 8192
                },
                "treasury_symbol": {
                  "type": "string",
                  "maxLength": 16
                },
                "voting_method": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 13,
                  "pattern": "^[a-z1-5.]*$"
                },
                "min_options": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 255
                },
                "max_options": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 255
                },
                "options": {
                  "maxItems": 256,
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "string",
                        "maxLength": 13,
                        "pattern": "^[a-z1-5.]*$"
                      },
                      "value": {
                        "type": "string",
                        "maxLength": 32,
                        "pattern": "^(0|[1-9][0-9]*)\\.[0-9]{4} VOTE$"
                      }
                    },
                    "required": [
                      "key",
                      "value"
                    ],
                    "additionalProperties": false
                  }
                },
                "total_voters": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "total_delegates": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "total_raw_weight": {
                  "type": "string",
                  "maxLength": 32,
                  "pattern": "^(0|[1-9][0-9]*)\\.[0-9]{4} VOTE$"
                },
                "cleaned_count": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 4294967295
                },
                "settings": {
                  "maxItems": 32,
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "string",
                        "maxLength": 13,
                        "pattern": "^[a-z1-5.]*$"
                      },
                      "value": {
                        "anyOf": [
                          {
                            "type": "number",
                            "const": 0
                          },
                          {
                            "type": "number",
                            "const": 1
                          }
                        ]
                      }
                    },
                    "required": [
                      "key",
                      "value"
                    ],
                    "additionalProperties": false
                  }
                },
                "begin_time": {
                  "type": "string",
                  "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?$"
                },
                "end_time": {
                  "type": "string",
                  "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?$"
                }
              },
              "required": [
                "ballot_name",
                "category",
                "publisher",
                "status",
                "title",
                "description",
                "content",
                "treasury_symbol",
                "voting_method",
                "min_options",
                "max_options",
                "options",
                "total_voters",
                "total_delegates",
                "total_raw_weight",
                "cleaned_count",
                "settings",
                "begin_time",
                "end_time"
              ],
              "additionalProperties": false
            }
          },
          "nextCursor": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "null"
              }
            ]
          },
          "observedAt": {
            "type": "string",
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"
          },
          "signingAvailable": {
            "type": "boolean"
          }
        },
        "required": [
          "source",
          "ballots",
          "nextCursor",
          "observedAt",
          "signingAvailable"
        ],
        "additionalProperties": false
      },
      "helpTopic": "telos-network-ballots"
    },
    {
      "method": "GET",
      "path": "/v1/telos/producers",
      "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "cursor": {
            "type": "string",
            "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
          }
        },
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "source": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "rpcUrl": {
                "type": "string",
                "maxLength": 512,
                "format": "uri"
              },
              "environment": {
                "type": "string",
                "enum": [
                  "local",
                  "testnet",
                  "mainnet"
                ]
              },
              "contract": {
                "type": "string",
                "const": "eosio"
              }
            },
            "required": [
              "chainId",
              "rpcUrl",
              "environment",
              "contract"
            ],
            "additionalProperties": false
          },
          "producers": {
            "maxItems": 25,
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "owner": {
                  "type": "string",
                  "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
                },
                "total_votes": {
                  "type": "string",
                  "maxLength": 128,
                  "pattern": "^(0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?$"
                },
                "is_active": {
                  "type": "boolean"
                },
                "url": {
                  "type": "string",
                  "maxLength": 2048
                },
                "location": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 65535
                }
              },
              "required": [
                "owner",
                "total_votes",
                "is_active",
                "url",
                "location"
              ],
              "additionalProperties": false
            }
          },
          "activeSchedule": {
            "maxItems": 125,
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
            }
          },
          "scheduleVersion": {
            "anyOf": [
              {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              {
                "type": "null"
              }
            ]
          },
          "totalVoteWeight": {
            "type": "string",
            "maxLength": 128,
            "pattern": "^(0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?$"
          },
          "nextCursor": {
            "anyOf": [
              {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              {
                "type": "null"
              }
            ]
          },
          "observedAt": {
            "type": "string",
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"
          }
        },
        "required": [
          "source",
          "producers",
          "activeSchedule",
          "scheduleVersion",
          "totalVoteWeight",
          "nextCursor",
          "observedAt"
        ],
        "additionalProperties": false
      },
      "helpTopic": "telos-network-ballots"
    },
    {
      "method": "GET",
      "path": "/v1/telos/ballots/:ballot",
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "source": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "rpcUrl": {
                "type": "string",
                "maxLength": 512,
                "format": "uri"
              },
              "contract": {
                "type": "string",
                "const": "telos.decide"
              },
              "environment": {
                "type": "string",
                "enum": [
                  "local",
                  "testnet",
                  "mainnet"
                ]
              },
              "codeHash": {
                "anyOf": [
                  {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "abiHash": {
                "anyOf": [
                  {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            },
            "required": [
              "chainId",
              "rpcUrl",
              "contract",
              "environment",
              "codeHash",
              "abiHash"
            ],
            "additionalProperties": false
          },
          "ballot": {
            "type": "object",
            "properties": {
              "ballot_name": {
                "type": "string",
                "minLength": 1,
                "maxLength": 13,
                "pattern": "^[a-z1-5.]*$"
              },
              "category": {
                "type": "string",
                "minLength": 1,
                "maxLength": 13,
                "pattern": "^[a-z1-5.]*$"
              },
              "publisher": {
                "type": "string",
                "minLength": 1,
                "maxLength": 13,
                "pattern": "^[a-z1-5.]*$"
              },
              "status": {
                "type": "string",
                "enum": [
                  "setup",
                  "voting",
                  "closed",
                  "cancelled",
                  "archived"
                ]
              },
              "title": {
                "type": "string",
                "maxLength": 4096
              },
              "description": {
                "type": "string",
                "maxLength": 4096
              },
              "content": {
                "type": "string",
                "maxLength": 8192
              },
              "treasury_symbol": {
                "type": "string",
                "maxLength": 16
              },
              "voting_method": {
                "type": "string",
                "minLength": 1,
                "maxLength": 13,
                "pattern": "^[a-z1-5.]*$"
              },
              "min_options": {
                "type": "integer",
                "minimum": 1,
                "maximum": 255
              },
              "max_options": {
                "type": "integer",
                "minimum": 1,
                "maximum": 255
              },
              "options": {
                "maxItems": 256,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "string",
                      "maxLength": 13,
                      "pattern": "^[a-z1-5.]*$"
                    },
                    "value": {
                      "type": "string",
                      "maxLength": 32,
                      "pattern": "^(0|[1-9][0-9]*)\\.[0-9]{4} VOTE$"
                    }
                  },
                  "required": [
                    "key",
                    "value"
                  ],
                  "additionalProperties": false
                }
              },
              "total_voters": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "total_delegates": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "total_raw_weight": {
                "type": "string",
                "maxLength": 32,
                "pattern": "^(0|[1-9][0-9]*)\\.[0-9]{4} VOTE$"
              },
              "cleaned_count": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "settings": {
                "maxItems": 32,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "string",
                      "maxLength": 13,
                      "pattern": "^[a-z1-5.]*$"
                    },
                    "value": {
                      "anyOf": [
                        {
                          "type": "number",
                          "const": 0
                        },
                        {
                          "type": "number",
                          "const": 1
                        }
                      ]
                    }
                  },
                  "required": [
                    "key",
                    "value"
                  ],
                  "additionalProperties": false
                }
              },
              "begin_time": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?$"
              },
              "end_time": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?$"
              }
            },
            "required": [
              "ballot_name",
              "category",
              "publisher",
              "status",
              "title",
              "description",
              "content",
              "treasury_symbol",
              "voting_method",
              "min_options",
              "max_options",
              "options",
              "total_voters",
              "total_delegates",
              "total_raw_weight",
              "cleaned_count",
              "settings",
              "begin_time",
              "end_time"
            ],
            "additionalProperties": false
          },
          "signingAvailable": {
            "type": "boolean"
          },
          "observedAt": {
            "type": "string",
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"
          }
        },
        "required": [
          "source",
          "ballot",
          "signingAvailable",
          "observedAt"
        ],
        "additionalProperties": false
      },
      "helpTopic": "telos-network-ballots"
    },
    {
      "method": "GET",
      "path": "/v1/telos/ballots/:ballot/voters/:voter",
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "account": {
            "type": "string",
            "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
          },
          "registered": {
            "type": "boolean"
          },
          "weight": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 32,
                "pattern": "^(0|[1-9][0-9]*)\\.[0-9]{4} VOTE$"
              },
              {
                "type": "null"
              }
            ]
          },
          "alreadyVoted": {
            "type": "boolean"
          }
        },
        "required": [
          "account",
          "registered",
          "weight",
          "alreadyVoted"
        ],
        "additionalProperties": false
      },
      "helpTopic": "telos-network-ballots"
    },
    {
      "method": "POST",
      "path": "/v1/telos/votes/prepare",
      "input": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "ballot": {
            "type": "string",
            "minLength": 1,
            "maxLength": 13,
            "pattern": "^[a-z1-5.]*$"
          },
          "voter": {
            "type": "string",
            "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
          },
          "options": {
            "minItems": 1,
            "maxItems": 255,
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 13,
              "pattern": "^[a-z1-5.]*$"
            }
          }
        },
        "required": [
          "ballot",
          "voter",
          "options"
        ],
        "additionalProperties": false
      },
      "response": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "source": {
            "type": "object",
            "properties": {
              "chainId": {
                "type": "string",
                "pattern": "^[0-9a-f]{64}$"
              },
              "rpcUrl": {
                "type": "string",
                "maxLength": 512,
                "format": "uri"
              },
              "contract": {
                "type": "string",
                "const": "telos.decide"
              },
              "environment": {
                "type": "string",
                "enum": [
                  "local",
                  "testnet",
                  "mainnet"
                ]
              },
              "codeHash": {
                "anyOf": [
                  {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "abiHash": {
                "anyOf": [
                  {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            },
            "required": [
              "chainId",
              "rpcUrl",
              "contract",
              "environment",
              "codeHash",
              "abiHash"
            ],
            "additionalProperties": false
          },
          "ballot": {
            "type": "object",
            "properties": {
              "ballot_name": {
                "type": "string",
                "minLength": 1,
                "maxLength": 13,
                "pattern": "^[a-z1-5.]*$"
              },
              "category": {
                "type": "string",
                "minLength": 1,
                "maxLength": 13,
                "pattern": "^[a-z1-5.]*$"
              },
              "publisher": {
                "type": "string",
                "minLength": 1,
                "maxLength": 13,
                "pattern": "^[a-z1-5.]*$"
              },
              "status": {
                "type": "string",
                "enum": [
                  "setup",
                  "voting",
                  "closed",
                  "cancelled",
                  "archived"
                ]
              },
              "title": {
                "type": "string",
                "maxLength": 4096
              },
              "description": {
                "type": "string",
                "maxLength": 4096
              },
              "content": {
                "type": "string",
                "maxLength": 8192
              },
              "treasury_symbol": {
                "type": "string",
                "maxLength": 16
              },
              "voting_method": {
                "type": "string",
                "minLength": 1,
                "maxLength": 13,
                "pattern": "^[a-z1-5.]*$"
              },
              "min_options": {
                "type": "integer",
                "minimum": 1,
                "maximum": 255
              },
              "max_options": {
                "type": "integer",
                "minimum": 1,
                "maximum": 255
              },
              "options": {
                "maxItems": 256,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "string",
                      "maxLength": 13,
                      "pattern": "^[a-z1-5.]*$"
                    },
                    "value": {
                      "type": "string",
                      "maxLength": 32,
                      "pattern": "^(0|[1-9][0-9]*)\\.[0-9]{4} VOTE$"
                    }
                  },
                  "required": [
                    "key",
                    "value"
                  ],
                  "additionalProperties": false
                }
              },
              "total_voters": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "total_delegates": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "total_raw_weight": {
                "type": "string",
                "maxLength": 32,
                "pattern": "^(0|[1-9][0-9]*)\\.[0-9]{4} VOTE$"
              },
              "cleaned_count": {
                "type": "integer",
                "minimum": 0,
                "maximum": 4294967295
              },
              "settings": {
                "maxItems": 32,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "string",
                      "maxLength": 13,
                      "pattern": "^[a-z1-5.]*$"
                    },
                    "value": {
                      "anyOf": [
                        {
                          "type": "number",
                          "const": 0
                        },
                        {
                          "type": "number",
                          "const": 1
                        }
                      ]
                    }
                  },
                  "required": [
                    "key",
                    "value"
                  ],
                  "additionalProperties": false
                }
              },
              "begin_time": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?$"
              },
              "end_time": {
                "type": "string",
                "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,6})?$"
              }
            },
            "required": [
              "ballot_name",
              "category",
              "publisher",
              "status",
              "title",
              "description",
              "content",
              "treasury_symbol",
              "voting_method",
              "min_options",
              "max_options",
              "options",
              "total_voters",
              "total_delegates",
              "total_raw_weight",
              "cleaned_count",
              "settings",
              "begin_time",
              "end_time"
            ],
            "additionalProperties": false
          },
          "voter": {
            "type": "object",
            "properties": {
              "account": {
                "type": "string",
                "pattern": "^[a-z1-5][a-z1-5.]{0,12}$"
              },
              "registered": {
                "type": "boolean"
              },
              "weight": {
                "anyOf": [
                  {
                    "type": "string",
                    "maxLength": 32,
                    "pattern": "^(0|[1-9][0-9]*)\\.[0-9]{4} VOTE$"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "alreadyVoted": {
                "type": "boolean"
              }
            },
            "required": [
              "account",
              "registered",
              "weight",
              "alreadyVoted"
            ],
            "additionalProperties": false
          },
          "options": {
            "minItems": 1,
            "maxItems": 255,
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 13,
              "pattern": "^[a-z1-5.]*$"
            }
          },
          "expires": {
            "type": "string",
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"
          }
        },
        "required": [
          "source",
          "ballot",
          "voter",
          "options",
          "expires"
        ],
        "additionalProperties": false
      },
      "helpTopic": "telos-network-ballots"
    }
  ],
  "modules": [
    {
      "manifest": {
        "id": "quick-ballots",
        "version": "0.10.0-alpha.10",
        "coreRange": "0.15.0-alpha.46",
        "interfaceVersion": 1,
        "configVersion": 1,
        "capabilities": [
          "ballot.create",
          "ballot.finalize"
        ],
        "helpTopic": "quick-ballots"
      },
      "configuration": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "configVersion": {
            "type": "number",
            "const": 1
          }
        },
        "required": [
          "configVersion"
        ],
        "additionalProperties": false
      }
    },
    {
      "manifest": {
        "id": "activity",
        "version": "0.10.0-alpha.10",
        "coreRange": "0.15.0-alpha.46",
        "interfaceVersion": 1,
        "configVersion": 1,
        "capabilities": [
          "content.publish"
        ],
        "helpTopic": "activity"
      },
      "configuration": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "configVersion": {
            "type": "number",
            "const": 1
          },
          "reviewPolicy": {
            "type": "string",
            "const": "independent-reviewer"
          }
        },
        "required": [
          "configVersion",
          "reviewPolicy"
        ],
        "additionalProperties": false
      }
    },
    {
      "manifest": {
        "id": "decide",
        "version": "0.10.0-alpha.10",
        "coreRange": "0.15.0-alpha.46",
        "interfaceVersion": 1,
        "configVersion": 1,
        "capabilities": [
          "ballot.create",
          "ballot.finalize",
          "ballot.execute"
        ],
        "helpTopic": "decide"
      },
      "configuration": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "configVersion": {
            "type": "number",
            "const": 1
          },
          "weight": {
            "type": "string",
            "enum": [
              "member",
              "credit",
              "native-stake"
            ]
          },
          "duration": {
            "type": "integer",
            "minimum": 60,
            "maximum": 2592000
          },
          "quorumBasisPoints": {
            "type": "integer",
            "minimum": 1,
            "maximum": 10000
          },
          "approvalBasisPoints": {
            "type": "integer",
            "minimum": 5001,
            "maximum": 10000
          }
        },
        "required": [
          "configVersion",
          "weight",
          "duration",
          "quorumBasisPoints",
          "approvalBasisPoints"
        ],
        "additionalProperties": false
      }
    },
    {
      "manifest": {
        "id": "works",
        "version": "0.10.0-alpha.10",
        "coreRange": "0.15.0-alpha.46",
        "interfaceVersion": 1,
        "configVersion": 1,
        "capabilities": [
          "obligation.create",
          "obligation.execute"
        ],
        "helpTopic": "works"
      },
      "configuration": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "configVersion": {
            "type": "number",
            "const": 1
          },
          "maxMilestones": {
            "type": "integer",
            "minimum": 1,
            "maximum": 16
          },
          "reviewPolicy": {
            "type": "string",
            "const": "independent-reviewer"
          }
        },
        "required": [
          "configVersion",
          "maxMilestones",
          "reviewPolicy"
        ],
        "additionalProperties": false
      }
    },
    {
      "manifest": {
        "id": "payroll",
        "version": "0.10.0-alpha.10",
        "coreRange": "0.15.0-alpha.46",
        "interfaceVersion": 1,
        "configVersion": 1,
        "capabilities": [
          "obligation.create",
          "obligation.execute"
        ],
        "helpTopic": "payroll"
      },
      "configuration": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "configVersion": {
            "type": "number",
            "const": 1
          },
          "maxPeriods": {
            "type": "integer",
            "minimum": 1,
            "maximum": 12
          },
          "minIntervalSeconds": {
            "type": "integer",
            "minimum": 86400,
            "maximum": 2678400
          }
        },
        "required": [
          "configVersion",
          "maxPeriods",
          "minIntervalSeconds"
        ],
        "additionalProperties": false
      }
    },
    {
      "manifest": {
        "id": "grants-rounds",
        "version": "0.10.0-alpha.10",
        "coreRange": "0.15.0-alpha.46",
        "interfaceVersion": 1,
        "configVersion": 1,
        "capabilities": [
          "obligation.create"
        ],
        "helpTopic": "grants-rounds"
      },
      "configuration": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "configVersion": {
            "type": "number",
            "const": 1
          },
          "assetRail": {
            "type": "string",
            "const": "native"
          },
          "maxMilestones": {
            "type": "number",
            "const": 16
          },
          "matching": {
            "type": "boolean",
            "const": false
          }
        },
        "required": [
          "configVersion",
          "assetRail",
          "maxMilestones",
          "matching"
        ],
        "additionalProperties": false
      }
    },
    {
      "manifest": {
        "id": "endorsement-admission",
        "version": "0.10.0-alpha.10",
        "coreRange": "0.15.0-alpha.46",
        "interfaceVersion": 1,
        "configVersion": 1,
        "capabilities": [
          "member.manage"
        ],
        "helpTopic": "endorsement-admission"
      },
      "configuration": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "configVersion": {
            "type": "number",
            "const": 1
          },
          "witnessLimit": {
            "type": "number",
            "const": 64
          }
        },
        "required": [
          "configVersion",
          "witnessLimit"
        ],
        "additionalProperties": false
      }
    }
  ]
} satisfies HelpBundle;
