# BUILD Directory and build files
BUILD_DIR = ./build
BUILD_OBJ_DIR = $(BUILD_DIR)/obj
BUILD_TOBJ_DIR = $(BUILD_DIR)/obj/test

SRC_DIR = ./src
TEST_DIR = ./test

test_BIN = $(BUILD_DIR)/test
stress_test_BIN = $(BUILD_DIR)/stress_test
bench_BIN = $(BUILD_DIR)/bench
bench_brl_BIN = $(BUILD_DIR)/bench-brl
libjok_a = $(BUILD_DIR)/libjok.a

# Data generation flags.
DATA_GEN_FLAGS = --test-cases=$(TEST_CASES_N) --test-name=$(TEST_NAME)
DATA_GEN_SRC = $(TEST_DIR)/gen-data.c
DATA_GEN_OBJ = $(BUILD_TOBJ_DIR)/gen-data.o

# Compiler and linker configs.
WARNINGS := -Wall -Wextra -pedantic -Wshadow -Wpointer-arith -Wcast-align \
			-Wwrite-strings -Wmissing-prototypes -Wmissing-declarations \
			-Wredundant-decls -Wnested-externs -Winline \
			-Wuninitialized -Wconversion -Wstrict-prototypes
CFLAGS := $(CFLAGS) -O3 -std=c99 -D_GNU_SOURCE $(WARNINGS) -Iinclude/
LDFLAGS := $(LDFLAGS)

# Library file

# Sources
libjok_SRCS = $(SRC_DIR)/who-took.c $(SRC_DIR)/who-took-brl.c
test_BIN_SRCS = $(TEST_DIR)/test.c
stress_test_BIN_SRCS = $(TEST_DIR)/stress-test.c
bench_BIN_SRCS = $(TEST_DIR)/bench.c
bench_brl_BIN_SRCS = $(TEST_DIR)/bench-brl.c

## Objects
libjok_OBJS := $(libjok_SRCS:$(SRC_DIR)/%.c=$(BUILD_OBJ_DIR)/%.o)
libjok_DEPS := $(wildcard $(libjok_OBJS:%=%.d))

test_OBJS := $(test_BIN_SRCS:$(TEST_DIR)/%.c=$(BUILD_TOBJ_DIR)/%.o)
test_DEPS := $(wildcard $(test_OBJS:%=%.d))

stress_test_OBJS := $(stress_test_BIN_SRCS:$(TEST_DIR)/%.c=$(BUILD_TOBJ_DIR)/%.o)
stress_test_DEPS := $(wildcard $(stress_test_OBJS:%=%.d))

bench_OBJS := $(bench_BIN_SRCS:$(TEST_DIR)/%.c=$(BUILD_TOBJ_DIR)/%.o)
bench_DEPS := $(wildcard $(bench_OBJS:%=%.d))

bench_brl_OBJS := $(bench_brl_BIN_SRCS:$(TEST_DIR)/%.c=$(BUILD_TOBJ_DIR)/%.o)
bench_brl_DEPS := $(wildcard $(bench_brl_OBJS:%=%.d))

.PHONY: all check check_stress check_all clean clean_all

$(libjok_a): $(libjok_OBJS) | $(BUILD_DIR)
	$(AR) -crs $(libjok_a) $(libjok_OBJS)

$(BUILD_OBJ_DIR)/%.o: $(SRC_DIR)/%.c | $(BUILD_OBJ_DIR)
	$(CC) $(CFLAGS) -MD -MP -MF "$@.d" -c $< -o $@ $(LDFLAGS)

$(BUILD_TOBJ_DIR)/%.o: $(TEST_DIR)/%.c | $(BUILD_TOBJ_DIR)
	$(CC) $(CFLAGS) -MD -MP -MF "$@.d" -c $< -o $@ $(LDFLAGS)

include $(libjok_DEPS)
include $(test_DEPS)
include $(stress_test_DEPS)
include $(bench_DEPS)
include $(bench_brl_DEPS)

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(BUILD_OBJ_DIR): | $(BUILD_DIR)
	mkdir -p $(BUILD_OBJ_DIR)

$(BUILD_TOBJ_DIR): | $(BUILD_OBJ_DIR)
	mkdir -p $(BUILD_TOBJ_DIR)

$(test_BIN): $(test_OBJS) $(libjok_a)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

$(stress_test_BIN): $(DATA_GEN_OBJ) $(stress_test_OBJS) $(libjok_a)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

$(bench_BIN): $(DATA_GEN_OBJ) $(bench_OBJS) $(libjok_a)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

$(bench_brl_BIN): $(DATA_GEN_OBJ) $(bench_brl_OBJS) $(libjok_a)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

$(DATA_GEN_SRC):
	node scripts/gen-test.js $(DATA_GEN_FLAGS)

$(DATA_GEN_OBJ): $(DATA_GEN_SRC)
	$(CC) $(CFLAGS) -c $< -o $@ $(LDFLAGS)

all: $(libjok_a) $(test_BIN) $(stress_test_BIN) $(bench_BIN) $(bench_brl_BIN)

check: $(libjok_a) $(test_BIN)
	$(test_BIN)

check_stress: $(libjok_a) $(stress_test_BIN)
	$(stress_test_BIN)

check_all: check check_stress

bench: $(libjok_a) $(bench_BIN)
	$(bench_BIN)

clean:
	rm -f $(libjok_a) $(test_BIN) $(stress_test_BIN) $(bench_BIN) $(bench_brl_BIN)
	rm -f $(libjok_OBJS) $(test_OBJS) $(stress_test_OBJS) $(bench_OBJS) $(bench_brl_OBJS)
	rm -f $(libjok_DEPS) $(test_DEPS) $(stress_test_DEPS) $(bench_DEPS) $(bench_brl_DEPS)

clean_all: clean
	rm -f $(DATA_GEN_SRC) $(DATA_GEN_OBJ)
