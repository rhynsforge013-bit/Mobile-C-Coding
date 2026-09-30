#pragma once
// Mini Graphics Library for Mobile-C-Coding
// Drawing commands are emitted as JSON lines on stderr; the web frontend
// parses them and renders on a 2D canvas or a 3D (Three.js) scene.
//
// 2D coordinate space: origin top-left, x→right, y→down, canvas 400×400.
// 3D coordinate space: origin center, x→right, y→up, z→toward camera.

#include <iostream>
#include <sstream>
#include <string>

namespace gfx {

inline void emit(const std::string& json) {
    std::cerr << json << std::endl;
}

// ── shared state ──

inline void color(float r, float g, float b, float a = 1) {
    std::ostringstream ss;
    ss << "{\"cmd\":\"color\",\"r\":" << r << ",\"g\":" << g
       << ",\"b\":" << b << ",\"a\":" << a << "}";
    emit(ss.str());
}

// ── 2D commands ──

inline void clear(float r = 0, float g = 0, float b = 0) {
    std::ostringstream ss;
    ss << "{\"cmd\":\"clear\",\"r\":" << r << ",\"g\":" << g << ",\"b\":" << b << "}";
    emit(ss.str());
}

inline void circle(float x, float y, float radius) {
    std::ostringstream ss;
    ss << "{\"cmd\":\"circle\",\"x\":" << x << ",\"y\":" << y
       << ",\"r\":" << radius << "}";
    emit(ss.str());
}

inline void rect(float x, float y, float w, float h) {
    std::ostringstream ss;
    ss << "{\"cmd\":\"rect\",\"x\":" << x << ",\"y\":" << y
       << ",\"w\":" << w << ",\"h\":" << h << "}";
    emit(ss.str());
}

inline void line(float x1, float y1, float x2, float y2) {
    std::ostringstream ss;
    ss << "{\"cmd\":\"line\",\"x1\":" << x1 << ",\"y1\":" << y1
       << ",\"x2\":" << x2 << ",\"y2\":" << y2 << "}";
    emit(ss.str());
}

inline void point(float x, float y, float size = 3) {
    std::ostringstream ss;
    ss << "{\"cmd\":\"point\",\"x\":" << x << ",\"y\":" << y
       << ",\"s\":" << size << "}";
    emit(ss.str());
}

inline void text(const std::string& str, float x, float y, float size = 16) {
    std::string escaped;
    for (char c : str) {
        if (c == '"') escaped += "\\\"";
        else if (c == '\\') escaped += "\\\\";
        else if (c == '\n') escaped += "\\n";
        else escaped += c;
    }
    std::ostringstream ss;
    ss << "{\"cmd\":\"text\",\"t\":\"" << escaped << "\",\"x\":" << x
       << ",\"y\":" << y << ",\"s\":" << size << "}";
    emit(ss.str());
}

// ── 3D commands ──

inline void clear3d(float r = 0, float g = 0, float b = 0) {
    std::ostringstream ss;
    ss << "{\"cmd\":\"clear3d\",\"r\":" << r << ",\"g\":" << g << ",\"b\":" << b << "}";
    emit(ss.str());
}

inline void sphere(float x, float y, float z, float radius) {
    std::ostringstream ss;
    ss << "{\"cmd\":\"sphere\",\"x\":" << x << ",\"y\":" << y << ",\"z\":" << z
       << ",\"r\":" << radius << "}";
    emit(ss.str());
}

inline void box(float x, float y, float z, float w, float h, float d) {
    std::ostringstream ss;
    ss << "{\"cmd\":\"box\",\"x\":" << x << ",\"y\":" << y << ",\"z\":" << z
       << ",\"w\":" << w << ",\"h\":" << h << ",\"d\":" << d << "}";
    emit(ss.str());
}

inline void line3d(float x1, float y1, float z1, float x2, float y2, float z2) {
    std::ostringstream ss;
    ss << "{\"cmd\":\"line3d\",\"x1\":" << x1 << ",\"y1\":" << y1 << ",\"z1\":" << z1
       << ",\"x2\":" << x2 << ",\"y2\":" << y2 << ",\"z2\":" << z2 << "}";
    emit(ss.str());
}

// Signal that all drawing commands for this frame have been emitted.
inline void present() {
    emit("{\"cmd\":\"present\"}");
}

} // namespace gfx
