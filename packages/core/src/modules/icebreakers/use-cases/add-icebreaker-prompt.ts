import { db } from '@hack/db';
import { id } from '@hack/utils';

import { type AddIcebreakerPromptInput } from '../icebreakers.types';

export async function addIcebreakerPrompt(input: AddIcebreakerPromptInput) {
  await db
    .insertInto('icebreakerPrompts')
    .values({
      id: id(),
      text: input.text,
    })
    .execute();
}
