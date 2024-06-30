# Set up:
Using conda (optional):
```bash
conda create -n rocket python=3.11
conda activate rocket
```
Then:
```bash
pip install -r requirements.txt
```

# About project:
- Object detection of Heineken beer goods and products.
- Using YOLOv10, semantic compare similarities with majority vote support.
- We can create a system that can be used to track the objects like bottles, cans, banners of the brands for the company. No need to manually go check each vendors if they follows our advertisement campaign.

Notebook files:
- `train_yolov10`: Training YOLOv10 model, using provided data, self-labelled on RoboFlow
- `vdb`: Create a vector database support for semantic compare, assigning the brands for the objects based on their characteristics.
- `angelhack_server`: The main server for the system, acts like backend for the whole project, integrating models from various sources.
  