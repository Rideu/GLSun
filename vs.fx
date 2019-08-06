#version 100
precision highp float;

attribute vec4 position;

void main() {
  gl_Position = position;
  gl_PointSize = (364.0);
}