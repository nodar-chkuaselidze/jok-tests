#include <stdlib.h>
#include <jok.h>
#include "who-took-wasm.h"

jk_played_card_t *
jk_create_played_card(
  const jk_card_color card_color,
  const jk_card_level card_level,
  const jk_card_color jok_color,
  const bool jok_want
) {
  jk_played_card_t *played_card = (jk_played_card_t *)malloc(sizeof(jk_played_card_t));

  played_card->card.level = card_level;
  played_card->card.color = card_color;
  played_card->joker_action.color = jok_color;
  played_card->joker_action.want = jok_want;

  return played_card;
}

void
jk_free_played_card(jk_played_card_t *card) {
  free(card);
}

int
jk_who_took_wasm(
  jk_played_card_t *played_card1,
  jk_played_card_t *played_card2,
  jk_played_card_t *played_card3,
  jk_played_card_t *played_card4,
  jk_card_color trump_color,
  int first_card_index
) {
  jk_played_card_t played_cards[4] = {
    *played_card1,
    *played_card2,
    *played_card3,
    *played_card4
  };

  return jk_who_took(played_cards, trump_color, first_card_index);
}
