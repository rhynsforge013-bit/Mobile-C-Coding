export type Mode = 'text' | '2d' | '3d';

export const samples: Record<Mode, string> = {
  text: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    for (int i = 1; i <= 5; i++) {
        cout << "Line " << i << endl;
    }
    return 0;
}
`,
  '2d': `#include <iostream>
using namespace std;

int main() {
    // 2D drawing protocol: output commands to stdout
    cout << "BACKGROUND 20 20 40" << endl;
    cout << "COLOR 0 200 255" << endl;
    cout << "CIRCLE 200 200 80" << endl;
    cout << "COLOR 255 100 50" << endl;
    cout << "RECT 50 50 100 60" << endl;
    cout << "COLOR 100 255 100" << endl;
    cout << "LINE 10 10 390 390" << endl;
    cout << "COLOR 255 255 255" << endl;
    cout << "TEXT 120 280 Hello 2D" << endl;
    return 0;
}
`,
  '3d': `#include <iostream>
using namespace std;

int main() {
    // 3D drawing protocol: output commands to stdout
    cout << "CLEAR" << endl;
    cout << "CAMERA 5 5 5 0 0 0" << endl;
    cout << "COLOR 0 200 255" << endl;
    cout << "CUBE 0 0 0 1.5" << endl;
    cout << "COLOR 255 100 50" << endl;
    cout << "SPHERE 2.5 0 0 0.6" << endl;
    cout << "COLOR 100 255 100" << endl;
    cout << "SPHERE -2.5 0 0 0.6" << endl;
    return 0;
}
`,
};
