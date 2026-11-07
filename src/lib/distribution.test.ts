import { describe, expect, test } from "bun:test";
import { canAddDistribution, distributionTotal } from "./distribution";

describe("limite das distribuições", () => {
  test("soma dinamicamente as porcentagens ativas", () => {
    expect(distributionTotal([{ percentage: 35 }, { percentage: 65 }])).toBe(100);
  });
  test("bloqueia novas distribuições ao atingir 100%", () => {
    expect(canAddDistribution([{ percentage: 40 }, { percentage: 60 }])).toBe(false);
    expect(canAddDistribution([{ percentage: 60 }, { percentage: 45 }])).toBe(false);
  });
  test("libera criação após reduzir a soma abaixo de 100%", () => {
    expect(canAddDistribution([{ percentage: 40 }, { percentage: 59.9 }])).toBe(true);
  });
});