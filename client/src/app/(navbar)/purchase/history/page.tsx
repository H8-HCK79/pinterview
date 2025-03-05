import { ITransactionClient } from "@/interfaces/ITransaction";
import { cookies } from "next/headers";

export default async function TransactionTable() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token")?.value;

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/midtrans/history`,
    {
      method: "GET",
      headers: {
        Cookie: `access_token=${access_token}`,
      },
    }
  );
  const transactions: ITransactionClient[] = (await data.json()).data;

  console.log(transactions);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 text-left border-b">Order ID</th>
            <th className="py-3 px-6 text-left border-b">User ID</th>
            <th className="py-3 px-6 text-left border-b">Amount</th>
            <th className="py-3 px-6 text-left border-b">Quota</th>
            <th className="py-3 px-6 text-left border-b">Status</th>
            <th className="py-3 px-6 text-left border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-6 text-blue-600 hover:underline">
                <a href={tx.redirectUrl}> {tx.orderId}</a>
              </td>
              <td className="py-3 px-6">{tx.userId}</td>
              <td className="py-3 px-6">Rp {tx.amount.toLocaleString()}</td>
              <td className="py-3 px-6">{tx.quota || "-"}</td>
              <td
                className={`py-3 px-6 font-medium ${
                  tx.status === "Pending"
                    ? "text-yellow-600"
                    : tx.status === "Paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {tx.status}
              </td>
              <td className="py-3 px-6 text-gray-600">
                {new Date(tx.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
