
# BUILD Directory and build files
BUILD_DIR = ./build

test_BIN = $(BUILD_DIR)/test
stress_test_BIN = $(BUILD_DIR)/stress_test
bench_BIN = $(BUILD_DIR)/bench
bench_brl_BIN = $(BUILD_DIR)/bench-brl
libjok_a = $(BUILD_DIR)/libjok.a

# Data generation flags.
DATA_GEN_FLAGS = --test-cases=$(TEST_CASES_N) --test-name=$(TEST_NAME)

# Compiler and linker configs.
WARNINGS := -Wall -Wextra -pedantic -Wshadow -Wpointer-arith -Wcast-align \
			-Wwrite-strings -Wmissing-prototypes -Wmissing-declarations \
			-Wredundant-decls -Wnested-externs -Winline \
			-Wuninitialized -Wconversion -Wstrict-prototypes
CFLAGS := $(CFLAGS) -O3 -std=c99 -D_GNU_SOURCE $(WARNINGS) -Iinclude/
LDFLAGS := $(LDFLAGS)

# Library file

# Sources
libjok_SRCS = ./src/who-took.c ./src/who-took-brl.c
test_BIN_SRCS = ./test/test.c
stress_test_BIN_SRCS = ./test/stress-test.c
bench_BIN_SRCS = ./test/bench.c
bench_brl_BIN_SRCS = ./test/bench-brl.c

## Objects
libjok_OBJS := $(libjok_SRCS:%.c=%.o)
libjok_DEPS := $(wildcard $(libjok_OBJS:%=%.d))

test_OBJS := $(test_BIN_SRCS:%c=%o)
test_DEPS := $(wildcard $(test_OBJS:%=%.d))

stress_test_OBJS := $(stress_test_BIN_SRCS:%c=%o)
stress_test_DEPS := $(wildcard $(stress_test_OBJS:%=%.d))

bench_OBJS := $(bench_BIN_SRCS:%c=%o)
bench_DEPS := $(wildcard $(bench_OBJS:%=%.d))

bench_brl_OBJS := $(bench_brl_BIN_SRCS:%c=%o)
bench_brl_DEPS := $(wildcard $(bench_brl_OBJS:%=%.d))

%.o: %.c
	$(CC) $(CFLAGS) -MD -MP -MF "$@.d" -c $< -o $@ $(LDFLAGS) 

include $(libjok_DEPS)
include $(test_DEPS)
include $(stress_test_DEPS)
include $(bench_DEPS)
include $(bench_brl_DEPS)

$(libjok_a): $(libjok_OBJS) $(BUILD_DIR)
	$(AR) -crs $(libjok_a) $(libjok_OBJS)

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(test_BIN): $(test_OBJS) $(libjok_a)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

$(stress_test_BIN): test/gen-data.o $(stress_test_OBJS) $(libjok_a)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

$(bench_BIN): test/gen-data.o $(bench_OBJS) $(libjok_a)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

$(bench_brl_BIN): test/gen-data.o $(bench_brl_OBJS) $(libjok_a)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

test/gen-data.c:
	node scripts/gen-test.js $(DATA_GEN_FLAGS)

test/gen-data.o: test/gen-data.c
	$(CC) $(CFLAGS) -c test/gen-data.c -o $@ $(LDFLAGS)

all: $(libjok_a) $(test_BIN) $(stress_test_BIN) $(bench_BIN) $(bench_brl_BIN)

check: $(libjok_a) $(test_BIN)
	$(test_BIN)

check_stress: $(libjok_a) $(stress_test_BIN)
	$(stress_test_BIN)

check_all: check check_stress

bench: $(libjok_a) $(bench_BIN)
	$(bench_BIN)

clean:
	rm -f $(libjok_a) $(test_BIN) $(stress_test_BIN) $(bench_BIN)
	rm -f $(libjok_OBJS) $(test_OBJS) $(stress_test_OBJS) $(bench_OBJS)
	rm -f $(libjok_DEPS) $(test_DEPS) $(stress_test_DEPS) $(bench_DEPS)

clean_all: clean
	rm -f test/gen-data.c
	rm -f test/gen-data.o

.PHONY: all check check_stress check_all clean clean_all
