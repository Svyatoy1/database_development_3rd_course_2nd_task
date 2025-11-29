db.results.aggregate([
  {
    $group: {
      _id: "$event_id",
      avgPoints: { $avg: "$points" }
    }
  },
  { $sort: { _id: 1 } }
]).toArray();