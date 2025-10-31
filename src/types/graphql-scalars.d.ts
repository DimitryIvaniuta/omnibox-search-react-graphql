// src/types/graphql-scalars.d.ts
import type DecimalJs from "decimal.js";
declare global {
    type Decimal = DecimalJs; // or DecimalJs.Value if you want inputs too
}
export {};
