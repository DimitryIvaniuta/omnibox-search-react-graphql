import React, {useMemo} from "react";

type User = {
    id: string;
    name: string;
};

type Message = {
    id: string;
    text: string;
    fromUserId: string;
    createdAt: number;
};

type ChatInboxProps = {
    users: User[];
    messages: Message[];
}
type UserMessage = {
    user: User | undefined;
    message: Message;
}

const ChatInbox = ({users, messages}: ChatInboxProps) => {

    const userById = useMemo(() => {
        const m = new Map<string, User>();
        for (const u of users) {
            m.set(u.id, u);
        }
        return m;
    }, [users]);

    const lastByUser = useMemo(
        () => {
            const m = new Map<string, Message>();
            for (const msg of messages) {
                const prev = m.get(msg.fromUserId);
                if (!prev || msg.createdAt > prev.createdAt) {
                    m.set(msg.fromUserId, msg);
                }
            }
            return m;
        },
        [messages]
    );

    const rows = useMemo(
        () => {
            return Array.from(lastByUser.entries())
                .map(
                    ([userId, message]) => {
                        return {
                            user: userById.get(userId),
                            message,
                        }
                    }
                )
                .filter(
                    (x): x is UserMessage => !!x.user
                )
                .sort((a, b) => b.message.createdAt - a.message.createdAt);
        },
        [userById, lastByUser]
    )

    return (
        <div>
            <h3>Inbox</h3>
            {rows.length === 0 ?
                (
                    <div>No Messages</div>
                ) : (
                    <ul>
                        {rows.map(({user, message}) => (
                            <li key={message.id}>
                                <strong>
                                    {user?.name}: {message.text}
                                </strong>
                            </li>
                        ))}
                    </ul>
                )
            }
        </div>
    );

}
