package main

import (
	"testing"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

func TestGoker(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Goker Suite")
}
