#ifndef JOK_TYPES_H
#define JOK_TYPES_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __EMSCRIPTEN__
#  include <emscripten.h>
#  define JK_EXPORT EMSCRIPTEN_KEEPALIVE
#else
#  define JK_EXPORT
#endif


typedef enum {
  JK_HEARTS = 0,
  JK_DIAMONDS = 1,
  JK_SPADES = 2,
  JK_CLUBS = 3,
  JK_NONE = 4, // Only in 9-card game.
  JK_NULL = 5, // Joker wants (Joker contested)
} jk_card_color;

typedef enum {
  JK_06 = 0,
  JK_07 = 1,
  JK_08 = 2,
  JK_09 = 3,
  JK_10 = 4,
  JK_JACK = 5,
  JK_QUEEN = 6,
  JK_KING = 7,
  JK_ACE = 8,
} jk_card_level;

// Struct typedefs.
typedef struct jk_jok_action_s jk_jok_action_t;
typedef struct jk_card_s jk_card_t;
typedef struct jk_played_card_s jk_played_card_t;

// Struct declarations

struct jk_jok_action_s {
  // Does joker want to take.
  jk_card_color color;
  bool want;
};

struct jk_card_s {
  jk_card_level level;
  jk_card_color color;
};

struct jk_played_card_s {
  jk_card_t card;
  jk_jok_action_t joker_action;
};

// API
JK_EXPORT int jk_who_took(
    jk_played_card_t *played_cards,
    jk_card_color trump_color,
    int first_card_index
);

JK_EXPORT int jk_who_took_brl(
    jk_played_card_t *played_cards,
    jk_card_color trump_color,
    int first_card_index
);

JK_EXPORT jk_played_card_t *
jk_create_played_card(
  const jk_card_color card_color,
  const jk_card_level card_level,
  const jk_card_color jk_card_color,
  const bool jok_want
);

JK_EXPORT int
jk_who_took_wasm(
  jk_played_card_t *played_card1,
  jk_played_card_t *played_card2,
  jk_played_card_t *played_card3,
  jk_played_card_t *played_card4,
  jk_card_color trump_color,
  int first_card_index
);

#endif // JOK_TYPES_H
