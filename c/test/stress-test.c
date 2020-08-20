#include <assert.h>
#include <stdio.h>
#include "test.h"
#include "gen-data.h"

int
main(void) {
  for (long unsigned int i = 0; i < ARRAY_SIZE(STRESS_TESTS); i++) {
    test_data_entry_t entry = STRESS_TESTS[i];

    printf("Running test: %s\n", entry.name);
    for (int j = 0; j < entry.no_cases; j++) {
      test_data_case_t tcase = entry.cases[j];
      int res = jk_who_took(
          entry.cards,
          tcase.trump_color,
          tcase.first_card_index
      );

      printf("  testing case: %d\n", j);
      fflush(stdout);
      ASSERT_INT_EQ(res, tcase.expected_result);
    }
  }

  return 0;
}
