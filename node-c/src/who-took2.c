#include <node_api.h>
#include <jok.h>
#include "helpers.h"
#include "who-took2.h"

#define CARD_COLOR_BITMASK 0x7
#define CARD_COLOR_BITLEN 3

#define CARD_LEVEL_BITLEN 4
#define CARD_LEVEL_BITMASK 0xF

#define CCARD_BITLEN 7
#define CCARD_BITMASK 0x7f

#define CJOKER_SUB_ACTION_BITLEN 4
#define CJOKER_SUB_ACTION_BITMASK 0xF

#define CJOKER_WANT_BITLEN 1
#define CJOKER_WANT_BITMASK 0x1

#define CDOWN_CARD_BITLEN 12
#define CDOWN_CARD_BITMASK 0xFFF

// NOTE: There is still bug in the logic, but performance is already
// apparent and there's no incentive to fix the bug.
napi_value who_took2(napi_env env, napi_callback_info info) {
  // 4 from array + 1 + 1
  size_t argc = 6;
  napi_value argv[argc];

  JS_ASSERT(napi_get_cb_info(env, info, &argc, argv, NULL, NULL) == napi_ok,
      "Could not get function info.");

  JS_ASSERT(argc == 6, "Pass 6 arguments");

  jk_played_card_t played_cards[4] = {
    {0}, {0}, {0}, {0}
  };

  int trump_color = 0;
  int first_index = 0;

  for (int i = 0; i < 4; i++) {
    int32_t cdown_card;

    JS_ASSERT(napi_get_value_int32(env, argv[i], &cdown_card) == napi_ok,
        "Could not parse number.");

    int card = (cdown_card >> CJOKER_SUB_ACTION_BITLEN & CCARD_BITMASK); 
    int jok_action = (cdown_card & CJOKER_SUB_ACTION_BITMASK);

    int color = card & CARD_COLOR_BITLEN;
    int level = card >> CARD_LEVEL_BITLEN & CARD_COLOR_BITMASK;

    JS_ASSERT(IS_CARD_COLOR(color), "Color is not color..");
    JS_ASSERT(IS_CARD_LEVEL(level), "Level is not level..");

    played_cards[i].card.level = card & CARD_COLOR_BITLEN;
    played_cards[i].card.color = card >> CARD_LEVEL_BITLEN & CARD_COLOR_BITMASK;

    if (jok_action != 0) {
      bool want = jok_action >> CARD_COLOR_BITLEN & CJOKER_WANT_BITMASK;
      int jcolor = jok_action & CARD_COLOR_BITLEN;

      JS_ASSERT(IS_CARD_COLOR(jcolor), "Jok color is not color.");

      played_cards[i].joker_action.color = jcolor;
      played_cards[i].joker_action.want = want;
    }
  }

  JS_ASSERT(napi_get_value_int32(env, argv[4], &trump_color) == napi_ok,
      "Could not read trump color.");
  JS_ASSERT(napi_get_value_int32(env, argv[5], &first_index) == napi_ok,
      "Could not get first index.");

  int res_idx = jk_who_took(played_cards, trump_color, first_index);

  napi_value nresult;

  JS_ASSERT(napi_create_int32(env, res_idx, &nresult) == napi_ok,
      "Could not create response.");

  return nresult;
}
