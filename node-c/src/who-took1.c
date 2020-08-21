#include <node_api.h>
#include <jok.h>
#include "helpers.h"
#include "who-took1.h"

napi_status get_jok_action(napi_env env, napi_value naction,
                           jk_jok_action_t *action) {
  napi_valuetype type;
  napi_status status;

  status = napi_typeof(env, naction, &type);

  if (status != napi_ok)
    return status;

  if (type == napi_null)
    return napi_ok;

  if (type != napi_object)
    return napi_invalid_arg;

  napi_value nwant;
  napi_value ncolor;
  napi_valuetype ncolor_type;

  bool want;
  int32_t color;

  WT_GET_PROPERTY(naction, "want", &nwant);
  WT_GET_PROPERTY(naction, "color", &ncolor);

  WT_GET_BOOL(nwant, &want);

  action->want = want;

  status = napi_typeof(env, ncolor, &ncolor_type);

  if (status != napi_ok)
    return status;

  if (ncolor_type == napi_null)
    return napi_ok;

  WT_GET_INT32(ncolor, &color);

  if (color == -1)
    color = JK_NULL;

  if (!IS_CARD_COLOR(color))
    return napi_invalid_arg;

  action->color = color;

  return napi_ok;
}

napi_status get_down_card(napi_env env, napi_value down_card,
                          jk_played_card_t *played_card) {
  napi_status status;
  uint32_t length;

  napi_value ncolor, nlevel, naction;
  int32_t color, level;

  status = napi_get_array_length(env, down_card, &length);

  if (status != napi_ok || length < 2 || length > 3)
    return napi_invalid_arg;

  WT_GET_ELEMENT(down_card, 0, &ncolor);
  WT_GET_ELEMENT(down_card, 1, &nlevel);

  WT_GET_INT32(ncolor, &color);
  WT_GET_INT32(nlevel, &level);


  if (!IS_CARD_LEVEL(level))
    return napi_invalid_arg;

  if (!IS_CARD_COLOR(color))
    return napi_invalid_arg;

  played_card->card.color = color;
  played_card->card.level = level;

  if (length == 2)
    return napi_ok;

  WT_GET_ELEMENT(down_card, 2, &naction);
  status = get_jok_action(env, naction, &played_card->joker_action);

  if (status != napi_ok)
    return status;

  return napi_ok;
}

napi_value who_took1(napi_env env, napi_callback_info info) {
  size_t argc = 3;
  napi_value argv[argc];

  {
    napi_status status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);

    if (status != napi_ok) {
      napi_throw_error(env, NULL, "Failed to get args.");
      return NULL;
    }
  }

  ASSERT_IS_ARRAY(env, argv[0], "First argument must be an array");

  napi_value down_cards = argv[0];
  int32_t trump_color;
  int32_t first_index;

  ASSERT_ARRAY_HAS_N_ELEMENTS(env, down_cards, 4);

  jk_played_card_t played_cards[4] = {{0}, {0}, {0}, {0}};

  for (int i = 0; i < 4; i++) {
    napi_value dcard;
    if (napi_get_element(env, down_cards, i, &dcard) != napi_ok) {
      napi_throw_type_error(env, "EINVAL", "Could not get element.");
      return NULL;
    }

    if (get_down_card(env, dcard, &played_cards[i]) != napi_ok) {
      napi_throw_type_error(env, "EINVAL", "Invalid down card.");
      return NULL;
    }
  }

  if (napi_get_value_int32(env, argv[1], &trump_color) != napi_ok) {
    napi_throw_type_error(env, "EINVAL", "Invalid trump color.");
    return NULL;
  }

  if (!IS_CARD_COLOR(trump_color)) {
    napi_throw_type_error(env, "EINVAL", "Invalid trump color.");
    return NULL;
  }

  if (napi_get_value_int32(env, argv[2], &first_index) != napi_ok) {
    napi_throw_type_error(env, "EINVAL", "Invalid first index.");
    return NULL;
  }

  int who_took_idx = jk_who_took(played_cards, trump_color, first_index);

  napi_value result;
  if (napi_create_int32(env, who_took_idx, &result) != napi_ok) {
    napi_throw_error(env, NULL, "Failed to create int32.");
    return NULL;
  }

  return result;
}
