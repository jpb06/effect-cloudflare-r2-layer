import type { Context } from 'effect';
import { Effect, pipe } from 'effect';

export const tapLayer = <L, R, E, A>(
  context: Context.Tag<L, L>,
  effect: (layer: L) => Effect.Effect<R, E, A>,
) => pipe(context, Effect.flatMap(effect));
