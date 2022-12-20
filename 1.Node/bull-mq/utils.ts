import { setTimeout } from "timers/promises";
import { DoSomeHeavyComputingJob } from "./jobs";

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
};

export const DoSomeHeavyComputingUseCase = async (
  job: DoSomeHeavyComputingJob
) => {
  await setTimeout(job.data.magicNumber * 1000, () => {
    return getRandomInt(1, 10000);
  });
};
