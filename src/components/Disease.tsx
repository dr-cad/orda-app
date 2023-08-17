import { IDisease } from "../types/interfaces";

function Disease({ id, name }: IDisease) {
  return (
    <div>
      {id}:{name}
    </div>
  );
}

export default Disease;
