exports.getTailorInfo = (req, res) => {
  console.log("Received files:", req.files);
  console.log("Received body:", req.body);
  res.status(200).json({ message: "Data received successfully" });
};
