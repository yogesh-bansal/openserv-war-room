# Postmortem Draft — Northstar Bridge

Incident `wr-50b1139bff` was tracked as a critical signature validation exploit affecting Northstar Bridge on Base.

## Executive Summary

Northstar Bridge experienced a critical signature validation exploit. User impact centered on bridge withdrawals are paused and some pending transfers may be delayed for several hours.

## Timeline

- 2026-03-17T09:12:00Z incident detected via OpenZeppelin Defender alert
- T+05m containment discussion opened and on-call owners assigned
- T+15m first user-safe status update prepared
- T+30m signer and contract diff review underway
- T+60m restoration or longer pause decision prepared for leadership

## Root Cause Candidates

- A verifier contract update appears to have accepted malformed signatures under a narrow edge case.
- a recent contract or signer configuration change widened acceptance criteria unexpectedly
- monitoring may have captured a partial failure before a wider exploit path was exercised

## Prevention Work

- add deployment diff checks for signer quorum changes
- require simulated malformed-signature tests before verifier upgrades
- create a pre-approved incident comms template for bridge pauses
- attach post-incident runbooks to the next production readiness review

## Follow-Ups

- incident-commander: declare incident channel, freeze unrelated deploys, confirm severity
- forensics: diff verifier logic, reconcile suspicious transfers, preserve traces
- comms: publish initial user-safe update and prepare partner briefing
- protocol-engineering: validate rollback or patched pause path before restoration
- leadership: decide whether to extend pause window and engage external responders
