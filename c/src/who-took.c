#include <assert.h>
#include <stdio.h>
#include <stddef.h>
#include "who-took.h"

int
jk_who_took(
  jk_played_card_t *played_cards,
  jk_card_color trump_color,
  int first_card_index
) {
  jk_card_color joker_dwant_color = JK_NULL;
  bool joker_dwant = false;
  bool j_want_nontrump = false;

  jk_played_card_t first_card = played_cards[first_card_index];
  jk_card_color first_color = get_first_color(first_card);

  bool is_first_joker = is_joker_card(first_card);
  jk_jok_action_t j_action = first_card.joker_action;

  if (is_first_joker) {
    j_want_nontrump = j_action.color != trump_color;

    if (!j_action.want) {
      joker_dwant = true;
      joker_dwant_color = j_action.color;
    }
  }

  int values[4] = {-1, -1, -1, -1};

  for (int i = 0; i < 4; i++) {
    jk_played_card_t pcard = played_cards[i];
    bool is_first = i == first_card_index;
    bool is_joker = is_joker_card(pcard);

    if (is_joker) {
      if (pcard.joker_action.want) {
        int priority = 100;

        if (is_first && j_want_nontrump)
          priority = 20;

        values[i] = priority + (((i - first_card_index) % 4) & 3);
        continue;
      }

      if (is_first) {
        values[i] = 1;
        continue;
      }

      values[i] = 0;
      continue;
    }

    bool is_trump_color = pcard.card.color == trump_color;
    bool is_first_card_color = pcard.card.color == first_color;

    if (!is_first && !is_trump_color && !is_first_card_color) {
      values[i] = 0;
      continue;
    }

    int priority = (int)pcard.card.level + 1;

    if (is_trump_color)
      priority += 50;

    if (joker_dwant && pcard.card.color == joker_dwant_color)
      priority += 20;

    values[i] = priority;
  }

  int maxIndex = 0;
  int max = -1;

  for (int i = 0; i < 4; i++) {
    if (values[i] > max) {
      maxIndex = i;
      max = values[i];
    }
  }

  return maxIndex;
}

inline bool
is_joker_card(jk_played_card_t played) {
  if (played.card.level != JK_06)
    return false;

  return played.card.color == JK_SPADES || played.card.color == JK_CLUBS;
}

inline jk_card_color
get_first_color(jk_played_card_t first_card) {
  if (is_joker_card(first_card)) {
    return first_card.joker_action.color;
  }

  return first_card.card.color;
}
