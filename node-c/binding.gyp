{
  "targets": [
    {
      "target_name": "libjok",
      "type": "static_library",
      "include_dirs": [
        "../c/include"
      ],
      "sources": [
        "../c/src/who-took.c",
      ],
      "conditions": [
        ["OS == 'mac'", {
          "xcode_settings": {
            "MACOSX_DEPLOYMENT_TARGET": "10.7",
            "GCC_C_LANGUAGE_STANDARD": "c99",
            "OTHER_CFLAGS": [
            ],
            "WARNING_CFLAGS": [
              "-Wpedantic",
              "-Wall",
              "-Wextra",
              "-Wbad-function-cast",
              "-Wdisabled-optimization",
              "-Wcast-align",
              "-Wshadow",
            ]
          }
        }],
        ["OS != 'mac' and OS != 'win'", {
          "cflags": [
            "-std=c99",
            "-Wpedantic",
            "-Wall",
            "-Wextra",
            "-Wbad-function-cast",
            "-Wdisabled-optimization",
            "-Wcast-align",
            "-Wshadow",
          ]
        }]
      ]
    },
    {
      "target_name": "jok",
      "include_dirs": [
        "../c/include",
        "<!(node -e \"require('napi-macros')\")"
      ],
      "dependencies": [
        "libjok",
      ],
      "sources": [
        "./src/helpers.c",
        "./src/who-took1.c",
        "./src/who-took2.c",
        "./src/jok.c",
      ],
      "conditions": [
        ["OS == 'mac'", {
          "xcode_settings": {
            "MACOSX_DEPLOYMENT_TARGET": "10.7",
            "GCC_C_LANGUAGE_STANDARD": "c99",
            "OTHER_CFLAGS": [
            ],
            "WARNING_CFLAGS": [
              "-Wpedantic",
              "-Wall",
              "-Wextra",
              "-Wbad-function-cast",
              "-Wdisabled-optimization",
              "-Wcast-align",
              "-Wshadow",
            ]
          }
        }],
        ["OS != 'mac' and OS != 'win'", {
          "cflags": [
            "-std=c99",
            "-Wpedantic",
            "-Wall",
            "-Wextra",
            "-Wno-missing-braces",
            "-Wbad-function-cast",
            "-Wdisabled-optimization",
            "-Wcast-align",
            "-Wshadow",
          ],
        }]
      ]
    }
  ]
}

