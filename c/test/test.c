#include <assert.h>
#include <stdio.h>
#include "test.h"

TEST_IMPL(win_ace) {
  jk_played_card_t cards[4] = {
    GET_CARD(JK_HEARTS, JK_07),
    GET_CARD(JK_HEARTS, JK_ACE),
    GET_CARD(JK_HEARTS, JK_KING),
    GET_CARD(JK_HEARTS, JK_JACK)
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_HEARTS, 0), 1);
  ASSERT_INT_EQ(jk_who_took(cards, JK_HEARTS, 1), 1);
  ASSERT_INT_EQ(jk_who_took(cards, JK_HEARTS, 2), 1);
  ASSERT_INT_EQ(jk_who_took(cards, JK_HEARTS, 3), 1);
  ASSERT_INT_EQ(jk_who_took(cards, JK_CLUBS, 3), 1);
  ASSERT_INT_EQ(jk_who_took(cards, JK_DIAMONDS, 3), 1);
  ASSERT_INT_EQ(jk_who_took(cards, JK_SPADES, 3), 1);
  ASSERT_INT_EQ(jk_who_took(cards, JK_NONE, 3), 1);

  return 0;
}

TEST_IMPL(win_trump) {
  jk_played_card_t cards[4] = {
    GET_CARD(JK_HEARTS, JK_07),
    GET_CARD(JK_HEARTS, JK_ACE),
    GET_CARD(JK_DIAMONDS,JK_07),
    GET_CARD(JK_HEARTS, JK_JACK),
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_DIAMONDS, 0), 2);
  ASSERT_INT_EQ(jk_who_took(cards, JK_DIAMONDS, 1), 2);
  ASSERT_INT_EQ(jk_who_took(cards, JK_DIAMONDS, 2), 2);
  ASSERT_INT_EQ(jk_who_took(cards, JK_DIAMONDS, 3), 2);

  return 0;
}

TEST_IMPL(win_first_card_no_color) {
  jk_played_card_t cards[4] = {
    GET_CARD(JK_CLUBS, JK_07),
    GET_CARD(JK_DIAMONDS, JK_ACE),
    GET_CARD(JK_HEARTS, JK_07),
    GET_CARD(JK_SPADES, JK_JACK),
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_NONE, 0), 0);
  ASSERT_INT_EQ(jk_who_took(cards, JK_NONE, 1), 1);
  ASSERT_INT_EQ(jk_who_took(cards, JK_NONE, 2), 2);
  ASSERT_INT_EQ(jk_who_took(cards, JK_NONE, 3), 3);

  return 0;
}

TEST_IMPL(special_case) {
  jk_played_card_t cards[4] = {
    GET_CARD(JK_HEARTS, JK_06),
    GET_CARD(JK_HEARTS, JK_08),
    GET_CARD(JK_HEARTS, JK_07),
    GET_CARD(JK_HEARTS, JK_10),
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_NONE, 2), 3);

  return 0;
}

TEST_IMPL(special_case2) {
  jk_played_card_t cards[4] = {
    GET_CARD(JK_DIAMONDS, JK_06),
    GET_CARD(JK_CLUBS, JK_07),
    GET_CARD(JK_CLUBS, JK_09),
    GET_CARD(JK_DIAMONDS, JK_QUEEN),
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_CLUBS, 2), 2);

  return 0;
}

TEST_IMPL(trump_is_joker) {
  jk_played_card_t cards[4] = {
    GET_CARD(JK_DIAMONDS, JK_QUEEN),
    GET_CARD(JK_SPADES, JK_QUEEN),
    GET_CARD(JK_HEARTS, JK_06),
    GET_CARD(JK_SPADES, JK_KING),
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_NONE, 0), 0);
  return 0;
}

TEST_IMPL(double_joker_wants) {
  jk_played_card_t cards[4] = {
    GET_JOK_CARD(JK_CLUBS, JK_06, true, JK_NULL),
    GET_CARD(JK_HEARTS, JK_07),
    GET_JOK_CARD(JK_SPADES, JK_06, true, JK_NULL),
    GET_CARD(JK_DIAMONDS, JK_07),
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_CLUBS, 3), 2);
  return 0;
}

TEST_IMPL(joker_dont_want) {
  jk_played_card_t cards[4] = {
    GET_CARD(JK_DIAMONDS, JK_10),
    GET_JOK_CARD(JK_CLUBS, JK_06, false, JK_HEARTS),
    GET_CARD(JK_HEARTS, JK_KING),
    GET_CARD(JK_SPADES, JK_08),
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_NONE, 1), 2);

  return 0;
}

TEST_IMPL(double_joker_dont_want) {
  jk_played_card_t cards[4] = {
    GET_CARD(JK_CLUBS, JK_09),
    GET_JOK_CARD(JK_CLUBS, JK_06, false, -1),
    GET_JOK_CARD(JK_SPADES, JK_06, false, JK_HEARTS),
    GET_CARD(JK_HEARTS, JK_06),
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_NONE, 2), 3);

  return 0;
}

TEST_IMPL(joker_wants_non_trump) {
  jk_played_card_t cards[4] = {
    GET_CARD(JK_DIAMONDS, JK_10),
    GET_JOK_CARD(JK_SPADES, JK_06, true, JK_HEARTS),
    GET_CARD(JK_HEARTS, JK_KING),
    GET_CARD(JK_SPADES, JK_08),
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_DIAMONDS, 1), 0);
  ASSERT_INT_EQ(jk_who_took(cards, JK_NONE, 1), 1);
  ASSERT_INT_EQ(jk_who_took(cards, JK_CLUBS, 1), 1);
  return 0;
}

TEST_IMPL(joker_wants_nontrump_but_another_joker_wants) {
  jk_played_card_t cards[4] = {
    GET_JOK_CARD(JK_SPADES, JK_06, true, JK_DIAMONDS),
    GET_CARD(JK_CLUBS, JK_10),
    GET_JOK_CARD(JK_CLUBS, JK_06, true, JK_NULL),
    GET_CARD(JK_DIAMONDS, JK_08),
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_CLUBS, 0), 2);

  return 0;
}

TEST_IMPL(joker_dont_want_but_still_takes) {
  jk_played_card_t cards[4] = {
    GET_CARD(JK_DIAMONDS, JK_10),
    GET_JOK_CARD(JK_SPADES, JK_06, false, JK_HEARTS),
    GET_CARD(JK_SPADES, JK_KING),
    GET_CARD(JK_SPADES, JK_08),
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_NONE, 1), 1);
  ASSERT_INT_EQ(jk_who_took(cards, JK_CLUBS, 1), 1);
  ASSERT_INT_EQ(jk_who_took(cards, JK_DIAMONDS, 1), 0);
  return 0;
}

TEST_IMPL(joker_dont_want_2) {
  jk_played_card_t cards[4] = {
    GET_CARD(JK_DIAMONDS, JK_10),
    GET_JOK_CARD(JK_SPADES, JK_06, false, JK_HEARTS),
    GET_CARD(JK_SPADES, JK_KING),
    GET_CARD(JK_SPADES, JK_08),
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_DIAMONDS, 1), 0);
  ASSERT_INT_EQ(jk_who_took(cards, JK_SPADES, 1), 2);

  return 0;
}

TEST_IMPL(joker_dont_want_and_takes_trump) {
  jk_played_card_t cards[4] = {
    GET_CARD(JK_DIAMONDS, JK_10),
    GET_JOK_CARD(JK_SPADES, JK_06, false, JK_SPADES),
    GET_CARD(JK_CLUBS, JK_KING),
    GET_CARD(JK_SPADES, JK_08),
  };

  ASSERT_INT_EQ(jk_who_took(cards, JK_CLUBS, 1), 2);
  return 0;
}


test_entry_t TESTS[] = {
  TEST_LIST_ADD(win_ace),
  TEST_LIST_ADD(win_trump),
  TEST_LIST_ADD(win_first_card_no_color),
  TEST_LIST_ADD(special_case),
  TEST_LIST_ADD(special_case2),
  TEST_LIST_ADD(trump_is_joker),
  TEST_LIST_ADD(double_joker_wants),
  TEST_LIST_ADD(joker_dont_want),
  TEST_LIST_ADD(double_joker_dont_want),
  TEST_LIST_ADD(joker_wants_non_trump),
  TEST_LIST_ADD(joker_wants_nontrump_but_another_joker_wants),
  TEST_LIST_ADD(joker_dont_want_but_still_takes),
  TEST_LIST_ADD(joker_dont_want_2),
  TEST_LIST_ADD(joker_dont_want_and_takes_trump)
};

int
main(void) {
  for (long unsigned int i = 0; i < ARRAY_SIZE(TESTS); i++) {
    test_entry_t entry = TESTS[i];
    entry.fn();
    printf("Test passed: %s\n", entry.name);
    fflush(stdout);
  }

  return 0;
}
