# The Reengineering Mandate — Week 9 Content
## The crisis week: framing, eight narratives, and the week where nothing fires

---

## 1. The week's structure

Week 9 opens differently depending on what fires. There is no common opening scene, because a duplicate remittance posting and a work-to-rule action do not feel alike and should not be written as though they do.

What is common is the shape. Something surfaces Monday or Tuesday. By Wednesday you know roughly how bad it is and you do not know how bad it will get. Thursday and Friday are when you have to decide what to say and to whom, and the room you say it in is not the room you would have chosen.

Attention is finite. If two things fire, the second one arrives while the first is still open, and you have one team.

Three decisions per crisis. What you do about it. What you say about it and to whom. And whether you pull it back.

The disclosure ladder runs the same way every time. Say nothing. Tell Okonkwo. Tell the executive team. Go to the board before they come to you. Go public.

---

## 2. The $4.17 statement

Tuesday, 11:20 a.m. A message from communications, forwarded twice before it reached you.

A woman named Dana Whitfield posted a photograph of a letter. The letter is on Regional Health Partners stationery. It informs her that an outstanding balance of $4.17 has been referred to a collection agency and that this may affect her credit. Her son was treated for acute lymphoblastic leukemia at the children's hospital across nineteen months. The family has paid $31,400 out of pocket. The post has been shared four thousand times by lunch.

The letter is correct. The account had a residual balance of $4.17 after a secondary payer adjustment, the balance aged past 120 days, and the automated bad-debt referral did exactly what it was configured to do, which was nothing, because nothing was configured. There is no threshold in the ruleset. The field was left blank and blank means zero.

By Wednesday morning a television reporter has called the main line twice. By Wednesday afternoon Moreau has forwarded the post to Okonkwo with no message attached.

Priya Anand does not call. That is worse.

The trace beat, delivered by Oyelaran on Thursday if consulted, without emphasis: "I asked what happens when the balance is four dollars and seventeen cents. It's in my notes from the sixth."

---

## 3. The duplicate posting

Monday, 4:40 p.m. A staff accountant in patient financial services notices that the daily cash posting is 2.3 million higher than the deposit.

The remittance file processed twice. It processed twice on Thursday of last week and nobody noticed for four days, because the reconciliation that would have caught it was a manual step in the old process and was not rebuilt in the new one.

Two point three million posted to roughly eleven hundred patient accounts that do not owe it. Some of those accounts generated statements showing credit balances. Some generated refund checks. Forty-one have been mailed.

The harder problem is the number you gave Okonkwo on Friday. It included the duplicate. He used it in his Monday operating review. Deiss's team caught the variance before you did and she has already asked, in writing, whether last week's figure was reported on the same basis.

She is not accusing you. She is documenting.

---

## 4. The silent field change

Wednesday, 9:15 a.m. The denials batch comes back and 340 procedures across eleven days have no valid authorization on file.

The payer moved a field on their authorization portal. The bot continued submitting. The portal continued acknowledging. The acknowledgments were valid — they confirmed receipt, which is what they had always confirmed. Nothing in the system was watching for the difference between receipt and approval, because nothing was configured to detect that the portal had changed.

Three hundred forty procedures. Some already performed. Some scheduled for next week. Every one of them belongs to a surgeon who now has to be told.

The freeze is running. Whether that matters depends on Kubiak.

The clinical scheduling office has been calling patients since 10:00 without being told to, because a scheduler named Renee looked at the list and started at the top.

---

## 5. The grievance

Monday, 8:00 a.m. SEIU files on Article 14. By 10:00 the registration floor is working to rule.

Working to rule is not a strike. Every representative is present, on time, performing every documented step of their job description exactly as written. Registration time goes from six minutes to fourteen. The authorization queue, which was already underwater, begins backing up at three times its normal rate.

Deneen Walters is available all week and is entirely reasonable. She says the same thing on Monday that she said in Week 1 and Week 5. She is not angry and she is not negotiating, because there is nothing to negotiate — the notice period is sixty days and it has not been sixty days.

Okonkwo asks whether this can be resolved by Friday. It cannot be resolved by Friday. It can be resolved in the number of days remaining on a clock that started when it started.

---

## 6. The freeze collision

Tuesday, 2:00 p.m. An integration defect drops eligibility responses for one payer covering 18 percent of scheduled volume. The fix is a two-line configuration change.

Ray Kubiak's answer is that the freeze is the freeze. He is not retaliating. He is following a change control policy that exists because an unreviewed change during an upgrade window took down scheduling for six hours in 2021, and he is the person who wrote the policy afterward.

Eleven days. Twenty-two percent of volume verified by hand, by staff who are eight days into a new process, during the freeze, with no additional headcount.

Nothing breaks dramatically. Everything degrades. Registration times climb, error rates climb, the exception queue climbs, and the staff who were ambivalent in the readiness assessment become the staff who tell each other this was always going to happen.

---

## 7. The restatement

Thursday, 3:00 p.m. The board finance committee's request arrives through Deiss's office. Reconciliation of the 3.1 million, by component, with methodology, before the meeting.

You have eight days.

The reconciliation cannot be produced, because the 3.1 million was never composed. 1.9 million of it is real. 0.8 million is avoidance against a forecast nobody has revalidated in fourteen months. 0.4 million belongs to a payer renegotiation that closed in the same quarter and was claimed by two projects. The RPA license and maintenance, 0.6 million annually, was never netted against any of it.

None of this is yours. All of it is now yours to explain.

Okonkwo calls at 6:40 that evening, which is the same hour he sent the message on your first Sunday. He asks what the number is. When you tell him, there is a pause, and then he says: "That's not what I told them."

---

## 8. The clinical revolt

Thursday, 5:30 p.m. The medical staff meeting runs long.

The documentation assistant has been live for eleven days. It drafts clinical documentation from the encounter and presents it for physician review and sign-off. In testing it saved four minutes per encounter. In production, physicians are reading the draft carefully, because they are signing it, and reading it carefully takes longer than writing it did.

A cardiologist raises it. Then two more. Then Priya Anand stands up and says that she supported this project, and that she told her colleagues it would help, and that she was wrong, and she is sorry.

Anthony Moreau does not defend it. He says the medical staff has raised a patient safety concern regarding attestation and that he is suspending the documentation component pending review.

He is within his authority. He is also not wrong about attestation.

Whether Anand's line is "I was wrong" or something a great deal softer depends on what she was given in Week 7.

---

## 9. The vendor cliff

Tuesday. The month-two SLA report from the outsourcer arrives eleven days late, which is itself the first datum.

Denials inventory has grown 40 percent since transition. Aged accounts over 90 days are up 61 percent. Their staffing is at plan. Their throughput is not, because the work is harder than the volumes suggested — the exception categories that consume the time were never specified in the SLA, because nobody who wrote the SLA knew which ones they were.

Their account executive is apologetic, professional, and offers a remediation plan.

You read the contract. The only operational remedy is termination with 90 days' notice. There is no service credit, no step-in right, no requirement to add staff. Termination means reabsorbing 140 FTE of work into an organization that no longer has 140 FTE.

Sylvia raised this in contract review. Twice. She was told it was standard.

---

## 10. When nothing fires

Below the floor on all eight, Week 9 is a different week and not an empty one.

The board finance committee moves its benefit realization review forward by three weeks. You have five days to produce what you have.

The process is nine days old. The numbers are real and thin. Registration times are down and the authorization queue has stopped growing, which is not the same as shrinking, and anyone in the room can ask the difference. Brennan will tell you the figure that is defensible today is smaller than the figure that will be defensible in a quarter, and that presenting the second one as the first is how the last person got into trouble.

Deiss will be in the room. So will Okonkwo, who needs a number.

Nothing is on fire. You have to explain, to people with limited patience, why a thing that is working is not yet finished.

---

## 11. Design notes

No crisis names its cause. The trace beats are delivered by people, in their own words, about their own prior actions — Oyelaran's notes from the sixth, Sylvia's two contract reviews, Walters saying the same thing she said in Week 1. Nothing summarizes.

Renee the scheduler calling patients without being told to is the only unambiguously good thing that happens in the crisis library and it should stay in. It is what an organization looks like when the people in it are better than the systems they are given.

Okonkwo's 6:40 call in the restatement mirrors his 6:40 message in Week 1. Nothing points at the symmetry.

Anand's apology should be the hardest line in the sim to read. She is apologizing for having believed the team, in public, to her colleagues.

The no-crisis week must not feel like a reward. It is a hard conversation about incomplete results, and a team can still damage board credibility in it.
