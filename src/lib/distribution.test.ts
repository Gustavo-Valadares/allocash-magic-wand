import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { canAddDistribution, distributionTotal } from "./distribution";

describe("limite das distribuições", () => {
  test("soma dinamicamente as porcentagens ativas", () => {
    assert.equal(distributionTotal([{ percentage: 35 }, { percentage: 65 }]), 100);
  });
  test("bloqueia novas distribuições ao atingir 100%", () => {
    assert.equal(canAddDistribution([{ percentage: 40 }, { percentage: 60 }]), false);
    assert.equal(canAddDistribution([{ percentage: 60 }, { percentage: 45 }]), false);
  });
  test("libera criação após reduzir a soma abaixo de 100%", () => {
    assert.equal(canAddDistribution([{ percentage: 40 }, { percentage: 59.9 }]), true);
  });
});