import { z } from 'zod';
import {
  BallotContentSchema,
  BallotMetadataSchema,
  BallotMetadataV3Schema,
  type BallotContent,
  type BallotMetadata,
  type BallotMetadataV3,
} from '../protocol/ballots.js';

export function encodeBallotMetadata(value: BallotMetadata | BallotMetadataV3): string {
  const metadata = JSON.stringify(value.schemaVersion === 3 ? BallotMetadataV3Schema.parse(value) : BallotMetadataSchema.parse(value));
  if (new TextEncoder().encode(metadata).length > 4096) throw new Error('BALLOT_METADATA_SIZE');
  return metadata;
}

export function readBallotMetadata(metadata: string, choices: number): BallotContent | undefined {
  if (choices < 2 || choices > 16 || new TextEncoder().encode(metadata).length > 4096) return;
  try {
    const value = z
      .object({ schemaVersion: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional() })
      .passthrough()
      .parse(JSON.parse(metadata));
    const content =
      value.schemaVersion === 3
        ? BallotMetadataV3Schema.parse(value)
        : value.schemaVersion === 2
        ? BallotMetadataSchema.parse(value)
        : BallotContentSchema.parse({
            ...value,
            options: value.options ?? (choices === 2 ? ['Reject', 'Approve'] : undefined),
          });
    if (content.options.length === choices) return content;
  } catch {
    // Missing or inconsistent choices must not become a different decision.
  }
}
