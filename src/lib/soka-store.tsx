import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  ME,
  SAMPLE_EMERGENCY,
  SAMPLE_GOALS,
  NEW_MEMBER_POOL,
  type CategoryId,
  type Contribution,
  type EmergencyFund,
  type Goal,
} from "./soka-data";

type CreateGoalInput = {
  title: string;
  category: CategoryId;
  target: number;
  deadline: string;
};

type SokaContextValue = {
  goals: Goal[];
  getGoal: (id: string) => Goal | undefined;
  createGoal: (input: CreateGoalInput) => Goal;
  addContribution: (goalId: string, amount: number) => Contribution;
  joinRandomMember: (goalId: string) => void;
  dismissBoost: (goalId: string) => void;
  recordPurchase: (goalId: string, purchase: NonNullable<Goal["purchase"]>) => void;
  emergency: EmergencyFund;
  addEmergencyContribution: (amount: number) => Contribution;
};

// Keep a single context instance across hot-module reloads, otherwise a reloaded
// copy of this module creates a new context and useSoka() sees no provider.
const globalRef = globalThis as typeof globalThis & {
  __sokaContext?: React.Context<SokaContextValue | null>;
};
const SokaContext =
  globalRef.__sokaContext ?? (globalRef.__sokaContext = createContext<SokaContextValue | null>(null));

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `SOKA-${out}`;
}

export function SokaProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(SAMPLE_GOALS);
  const [emergency, setEmergency] = useState<EmergencyFund>(SAMPLE_EMERGENCY);

  const addEmergencyContribution = useCallback((amount: number) => {
    const contribution: Contribution = {
      id: `e${Date.now()}`,
      memberId: ME.id,
      memberName: ME.name,
      amount,
      date: new Date().toISOString(),
      status: "success",
    };
    setEmergency((prev) => ({ ...prev, contributions: [contribution, ...prev.contributions] }));
    return contribution;
  }, []);

  const updateGoal = useCallback((id: string, fn: (g: Goal) => Goal) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? fn(g) : g)));
  }, []);

  const createGoal = useCallback((input: CreateGoalInput) => {
    const goal: Goal = {
      id: `g${Date.now()}`,
      title: input.title,
      category: input.category,
      target: input.target,
      deadline: input.deadline,
      code: randomCode(),
      members: [ME],
      contributions: [],
    };
    setGoals((prev) => [goal, ...prev]);
    return goal;
  }, []);

  const addContribution = useCallback(
    (goalId: string, amount: number) => {
      const contribution: Contribution = {
        id: `c${Date.now()}`,
        memberId: ME.id,
        memberName: ME.name,
        amount,
        date: new Date().toISOString(),
        status: "success",
      };
      updateGoal(goalId, (g) => ({ ...g, contributions: [contribution, ...g.contributions] }));
      return contribution;
    },
    [updateGoal],
  );

  const joinRandomMember = useCallback(
    (goalId: string) => {
      updateGoal(goalId, (g) => {
        const next = NEW_MEMBER_POOL.find((m) => !g.members.some((x) => x.id === m.id));
        return next ? { ...g, members: [...g.members, next] } : g;
      });
    },
    [updateGoal],
  );

  const dismissBoost = useCallback(
    (goalId: string) => updateGoal(goalId, (g) => ({ ...g, boostDismissed: true })),
    [updateGoal],
  );

  const recordPurchase = useCallback(
    (goalId: string, purchase: NonNullable<Goal["purchase"]>) =>
      updateGoal(goalId, (g) => ({ ...g, purchase })),
    [updateGoal],
  );

  const value = useMemo<SokaContextValue>(
    () => ({
      goals,
      getGoal: (id) => goals.find((g) => g.id === id),
      createGoal,
      addContribution,
      joinRandomMember,
      dismissBoost,
      recordPurchase,
      emergency,
      addEmergencyContribution,
    }),
    [goals, createGoal, addContribution, joinRandomMember, dismissBoost, recordPurchase, emergency, addEmergencyContribution],
  );

  return <SokaContext.Provider value={value}>{children}</SokaContext.Provider>;
}

export function useSoka() {
  const ctx = useContext(SokaContext);
  if (!ctx) throw new Error("useSoka must be used inside SokaProvider");
  return ctx;
}
