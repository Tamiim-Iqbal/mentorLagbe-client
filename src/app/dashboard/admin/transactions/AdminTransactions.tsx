import {
    Wallet,
    Search,
} from "lucide-react";

const AdminTransactions = () => {
    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Transactions
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                        Monitor all platform payments and transactions.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                    <Wallet size={16} className="text-brand" />

                    <span className="text-xs font-medium text-foreground">
                        Total Transactions: 0
                    </span>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">
                            All Transactions
                        </h2>

                        <p className="mt-1 text-xs text-muted">
                            Payment history and transaction records.
                        </p>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                        />

                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-foreground outline-none transition focus:border-brand"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px] text-left">
                        <thead>
                            <tr className="border-b border-border bg-background/50">
                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    User
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Role
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Plan Purchased
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Amount
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Transaction ID
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold text-muted">
                                    Paid Date
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-14 text-center"
                                >
                                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand/10">
                                        <Wallet
                                            size={20}
                                            className="text-brand"
                                        />
                                    </div>

                                    <h3 className="mt-3 text-sm font-semibold text-foreground">
                                        No transactions found
                                    </h3>

                                    <p className="mt-1 text-xs text-muted">
                                        Transaction records will appear here.
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border px-4 py-3">
                    <p className="text-xs text-muted">
                        Showing 0 transactions
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled
                            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted opacity-50"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            disabled
                            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTransactions;