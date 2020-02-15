import {
  Sandbox,
  PopularSandboxes,
  PickedSandboxes,
  PickedSandboxDetails,
} from '../../../../common/src//types';

type State = {
  pickedSandboxesIndexes: string[];
  popularSandboxes: PopularSandboxes;
  pickedSandboxesLoading: boolean;
  pickedSandboxes: PickedSandboxes;
  selectedSandbox: Sandbox;
  pickedSandboxDetails: PickedSandboxDetails;
};

export const state: State = {
  popularSandboxes: null,
  pickedSandboxes: null,
  pickedSandboxesIndexes: null,
  pickedSandboxesLoading: false,
  selectedSandbox: null,
  pickedSandboxDetails: null,
};
