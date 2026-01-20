import { IMessage } from "@/interface/message.interface";

export const mockMessages: IMessage[] = [
    {
        id: "msg_001",
        isRead: false,
        title: "Welcome to Our Community!",
        content: "We’re excited to have you here. Stay tuned for updates and new features!",
        image: "https://picsum.photos/seed/1/600/400",
        author: 'am7ZG7GytjOLEVt7jyu8d8Qo05l2',
        createdAt: 1733202000000,
        hasAttachment: true,
        attachment: {
            name: "Community_Guidelines.pdf",
            sizeBytes: 2516582,
            url: "https://example.com/guidelines.pdf"
        },
        preview: "We’re excited to have you here..."
    },
    {
        id: "msg_002",
        isRead: false,
        title: "Upcoming Meeting Reminder",
        content: "Don't forget about tomorrow’s community gathering at 19:00. See you there!",
        image: "https://picsum.photos/seed/1/600/400",
        author: 'am7ZG7GytjOLEVt7jyu8d8Qo05l2',
        createdAt: 1733205600000,
        hasAttachment: false,
        preview: "Don't forget about tomorrow’s community gathering..."
    },
    {
        id: "msg_003",
        isRead: false,
        title: "New Lesson Available",
        content: "A new lesson has been uploaded. Check it out in the Lessons tab.",
        image: "https://picsum.photos/seed/1/600/400",
        author: 'am7ZG7GytjOLEVt7jyu8d8Qo05l2',
        createdAt: 1733210000000,
        hasAttachment: true,
        attachment: {
            name: "Lesson_Plan_v1.pdf",
            sizeBytes: 1048576,
            url: "https://example.com/lesson.pdf"
        },
        preview: "A new lesson has been uploaded..."
    },
    {
        id: "msg_004",
        isRead: true,
        title: "Maintenance Completed",
        content: "The server maintenance was completed successfully. Everything is running smoothly.",
        image: "https://picsum.photos/seed/1/600/400",
        author: 'am7ZG7GytjOLEVt7jyu8d8Qo05l2',
        createdAt: 1733213600000,
        hasAttachment: false,
        preview: "The server maintenance was completed successfully..."
    },
    {
        id: "msg_005",
        isRead: false,
        title: "Campaign Update",
        content: "Our donation campaign reached 45% of its goal. Thank you to everyone contributing!",
        image: "https://picsum.photos/seed/1/600/400",
        author: 'am7ZG7GytjOLEVt7jyu8d8Qo05l2',
        createdAt: 1733220000000,
        hasAttachment: true,
        attachment: {
            name: "Campaign_Report.pdf",
            sizeBytes: 524288,
            url: "https://example.com/report.pdf"
        },
        preview: "Our donation campaign reached 45% of its goal..."
    },
    {
        id: "msg_006",
        isRead: true,
        title: "Holiday Celebration",
        content: "Join us for a special holiday event next week. Details will be shared soon.",
        image: "https://picsum.photos/seed/1/600/400",
        author: 'am7ZG7GytjOLEVt7jyu8d8Qo05l2',
        createdAt: 1733223600000,
        hasAttachment: false,
        preview: "Join us for a special holiday event next week..."
    },
    {
        id: "msg_007",
        isRead: false,
        title: "New Photos Added",
        content: "We’ve added new photos to the gallery. Check out the latest community moments!",
        image: "https://picsum.photos/seed/1/600/400",
       author: 'am7ZG7GytjOLEVt7jyu8d8Qo05l2',
        createdAt: 1733227200000,
        hasAttachment: true,
        attachment: {
            name: "Community_Moments.zip",
            sizeBytes: 15728640,
            url: "https://example.com/photos.zip"
        },
        preview: "We’ve added new photos to the gallery..."
    },
    {
        id: "msg_008",
        isRead: true,
        title: "Important Notice",
        content: "Please update your profile information to ensure you receive all notifications.",
        image: "https://picsum.photos/seed/1/600/400",
        author: 'am7ZG7GytjOLEVt7jyu8d8Qo05l2',
        createdAt: 1733230800000,
        hasAttachment: false,
        preview: "Please update your profile information..."
    },
    {
        id: "msg_009",
        isRead: false,
        title: "Special Announcement",
        content: "A big surprise is coming soon. Stay connected!",
        image: "https://picsum.photos/seed/1/600/400",
        author: 'am7ZG7GytjOLEVt7jyu8d8Qo05l2',
        createdAt: 1733234400000,
        hasAttachment: false,
        preview: "A big surprise is coming soon..."
    },
    {
        id: "msg_010",
        isRead: true,
        title: "Thank You!",
        content: "Thank you for being an active part of our community!",
        image: "https://picsum.photos/seed/1/600/400",
        author: 'am7ZG7GytjOLEVt7jyu8d8Qo05l2',
        createdAt: 1733238000000,
        hasAttachment: false,
        preview: "Thank you for being an active part of our community..."
    }
];
