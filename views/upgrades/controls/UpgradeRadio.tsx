import { Radio } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  ISelectedUnit,
  IUpgrade,
  IUpgradeOption,
} from "../../../data/interfaces";
import { applyUpgrade, removeUpgrade } from "../../../data/listSlice";
import UpgradeService from "../../../services/UpgradeService";
import hash from "object-hash";
import { RootState } from "../../../data/store";

export default function UpgradeRadio({
  selectedUnit,
  upgrade,
  option,
  isValid,
}: {
  selectedUnit: ISelectedUnit;
  upgrade: IUpgrade;
  option: IUpgradeOption;
  isValid: boolean;
}) {
  const dispatch = useDispatch();
  const army = useSelector((state: RootState) => state.army.data);

  const isApplied = (option) =>
    option
      ? UpgradeService.isApplied(selectedUnit, upgrade, option) // This option is applied
      : !upgrade.options.reduce(
          (prev, current) => prev || isApplied(current),
          false
        ); // Option is null, check no other options are applied

  const handleRadio = (option: IUpgradeOption | null) => {
    const applied = option ? isApplied(option) : false;

    if (!applied) {
      // Remove any other selections from group
      for (let opt of upgrade.options)
        if (isApplied(opt))
          dispatch(
            removeUpgrade({
              unitId: selectedUnit.selectionId,
              upgrade,
              option: opt,
            })
          );

      if (option)
        // Apply the selected upgrade
        dispatch(
          applyUpgrade({ unitId: selectedUnit.selectionId, upgrade, option, army })
        );
    }
  };

  // #endregion

  const thisApplied = isApplied(option);

  return (
    <Radio
      checked={thisApplied}
      onClick={() => handleRadio(option)}
      disabled={!isValid && !thisApplied}
      name={hash(upgrade)}
      color="primary"
      value={option?.label || "None"}
    />
  );

  //return ({ upgrade.options.map((opt, i) => (<p></p>)});
}
