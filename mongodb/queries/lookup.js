db.results.aggregate([
    { $match: { event_id: 100 } },

    {
        $lookup: {
            from: "athletes",
            localField: "athlete_id",
            foreignField: "athlete_id",
            as: "athlete"
        }
    },
    { $unwind: "$athlete" },

    {
        $lookup: {
            from: "events",
            localField: "event_id",
            foreignField: "event_id",
            as: "event"
        }
    },
    { $unwind: "$event" },

    {
        $project: {
            _id: 0,
            result_id: 1,
            points: 1,
            "athlete.first_name": 1,
            "athlete.last_name": 1,
            "event.name": 1
        }
    }
]);