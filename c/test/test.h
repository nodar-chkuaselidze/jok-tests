#ifndef TEST_H
#define TEST_H

#include <stdlib.h>
#include "jok.h"

typedef struct {
  const char *name;
  int (*fn)(void);
} test_entry_t;

typedef struct {
  jk_card_color trump_color;
  int first_card_index;
  int expected_result;
} test_data_case_t;

typedef struct {
  jk_played_card_t cards[4];
  test_data_case_t cases[20];
  const char *name;
  int no_cases;
} test_data_entry_t;

extern test_entry_t TESTS[];

// case
#define GET_CASE(trumpc, first_card_idx, res)                 \
  {                                                           \
    .trump_color = trumpc,                                    \
    .first_card_index = first_card_idx,                       \
    .expected_result = res                                    \
  }

// card
#define GET_CARD(col, lvl)                                    \
  { .card = { .level = lvl, .color = col } }

#define GET_JOK_CARD(col, lvl, wnt, jcol)                     \
  {                                                           \
    .card = { .level = lvl, .color = col },                   \
    .joker_action = { .color = jcol, .want = wnt }            \
  }

// helpers
#define ARRAY_SIZE(x) ((sizeof(x))/(sizeof(x[0])))

// asserts
#define ASSERT_BASE(expr, a, operator, b, type, conv)         \
 do {                                                         \
  if (!(expr)) {                                              \
    fprintf(stderr,                                           \
            "Assertion failed in %s on line %d: `%s %s %s` "  \
            "(%"#conv" %s %"#conv")\n",                       \
            __FILE__,                                         \
            __LINE__,                                         \
            #a,                                               \
            #operator,                                        \
            #b,                                               \
            (type)a,                                          \
            #operator,                                        \
            (type)b);                                         \
    fflush(stdout);                                           \
    abort();                                                  \
  }                                                           \
 } while (0)

#define ASSERT_INT_BASE(a, operator, b, type, conv)           \
 ASSERT_BASE(a operator b, a, operator, b, type, conv)

#define ASSERT_INT_EQ(a, b) ASSERT_INT_BASE(a, ==, b, int, d)

// Test list for normal test.
#define TEST_LIST_ADD(name) \
    {#name, &run_test_##name}

#define TEST_IMPL(name)                                       \
  int run_test_##name(void);                                  \
  int run_test_##name(void)


#endif // TEST_H
