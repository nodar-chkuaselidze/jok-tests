#include <assert.h>
#include <stdio.h>
#include <unistd.h>
#include <time.h>
#include "gen-data.h"
#include "test.h"
#include "bench.h"

void print_timediff(const char *name, uint64_t diff, uint64_t ops);
void donothing(int n);

int
main(void) {
  uint64_t begin = hrtime();

  for (uint64_t i = 0; i < ARRAY_SIZE(STRESS_TESTS); i++) {
    test_data_entry_t entry = STRESS_TESTS[i];

    for (int j = 0; j < entry.no_cases; j++) {
      test_data_case_t tcase = entry.cases[j];
      int res = jk_who_took(
          entry.cards,
          tcase.trump_color,
          tcase.first_card_index
      );
      donothing(res);
    }
  }

  uint64_t end = hrtime();
  uint64_t diff = end - begin;

  print_timediff("who-took", diff, ARRAY_SIZE(STRESS_TESTS));

  return 0;
}

void donothing(int n) {
  n++;
}

void print_timediff(const char *name, uint64_t diff, uint64_t ops) {
  double seconds = (double)diff / 1e9;
  uint64_t rate = (uint64_t)((double)ops / seconds);
  uint64_t perOp = diff / ops;

  printf("%s: ops=%lu, time=%fs, rate=%lu ops/s %lu ns/op",
      name, ops, seconds, rate, perOp);
}

uint64_t hrtime() {
  struct timespec t;

  if (clock_gettime(CLOCK_MONOTONIC, &t))
    return 0;  /* Not really possible. */

  return (uint64_t)t.tv_sec * (uint64_t) 1e9 + (uint64_t) t.tv_nsec;
}
