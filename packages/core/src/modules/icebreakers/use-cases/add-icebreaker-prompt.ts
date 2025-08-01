import { db } from '@hackcommunity/db';
import { id } from '@hackcommunity/utils';

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
