export const defaultCode2D = `#include "mini_graphics.h"

int main() {
    gfx::clear(0.1, 0.1, 0.15);

    // Draw a smiley face
    gfx::color(1, 0.8, 0.2);
    gfx::circle(200, 200, 100);

    gfx::color(0, 0, 0);
    gfx::circle(170, 180, 10);  // left eye
    gfx::circle(230, 180, 10);  // right eye

    gfx::color(1, 0.3, 0.3);
    gfx::rect(165, 230, 70, 8);  // smile

    gfx::color(0.3, 1, 0.5);
    gfx::text("Hello from C++!", 120, 360, 22);

    gfx::present();
    return 0;
}
`;

export const defaultCode3D = `#include "mini_graphics.h"

int main() {
    gfx::clear3d(0.08, 0.08, 0.14);

    gfx::color(1, 0.2, 0.2);
    gfx::sphere(0, 1, 0, 1);

    gfx::color(0.2, 0.8, 0.3);
    gfx::box(2.5, 0.5, 0, 1, 1, 1);

    gfx::color(0.2, 0.4, 1);
    gfx::sphere(-2.5, 0.5, 0, 0.8);

    gfx::color(1, 0.9, 0.2);
    gfx::box(0, 0.5, 2.5, 1, 1, 1);

    gfx::present();
    return 0;
}
`;
