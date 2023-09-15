'use client'

import { useParams, usePathname } from "next/navigation";

export default function TestPage2() {
  const path = usePathname();
  const params = useParams();
  const foo = params['tes']
  return (
    <div className="flex flex-col">
      <h1>
      Path is: {path}
      </h1>
      <h1>
        Params: {JSON.stringify(params)}
      </h1>
      <h1> foo: {foo}</h1>
    </div>
  );
}