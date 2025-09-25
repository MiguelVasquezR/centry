import { getGreating } from "@/src/utils/utils";
import { DateTime } from "luxon";

const Dashboard = () => {
  return (
    <div className="container">
      <br />
      <div>
        <div className="is-flex is-flex-direction-row is-justify-content-space-between">
          <p className="is-size-4">{getGreating()}, Miguel!</p>
          <p className="is-size-4">{DateTime.now().toFormat("dd/MM/yyyy")}</p>
        </div>
      </div>

      <br />

      <div>
        <p>Aquí podrás ver todos los prestamos</p>
      </div>
    </div>
  );
};

export default Dashboard;
