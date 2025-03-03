const boxes = [
  {
    name: "A",
    content: ""
  },
  {
    name: "B",
    content: ""
  },
  {
    name: "C",
    content: ""
  },
]

const contents = [
  {
    content: "This is box A content"
  },
  {
    content: "This is box B content"
  },
  {
    content: "This is box C content"
  },
]

function insertContentsToBoxes(boxes, contents) {
  return boxes.map((box, i) => {
    return {
      ...box,
      content: contents[i]
    }
  })
}

console.log(insertContentsToBoxes(boxes, contents))