---
title: "高数真题卷错误总结"
description: "记录自己错误的原因，方便回头快速回顾自己缺点"
pubDate: 2026-10-03

# `updatedDate`：可选。只有内容有实质更新时才填写；不需要时保持注释状态。
# updatedDate: 2026-09-26
draft: false

# `tags`：可选，默认 []。填写零个或多个跨内容类型主题标签。
# 暂时没有合适标签时保留 []；有标签时可以改成下面的列表形式。
tags:
  - "高数"
  - "真题"

# `category`：可选。只用于笔记，填写单一主要分类；没有分类就删除此行。
category: "考研"
series: "draduate-school-entrance-exam"
seriesTitle: "考研"
# `seriesOrder`：可选。系列内的正整数顺序；未填写的内容按发布日期从早到晚排列。
# seriesOrder: 1
related:
  - collection: "notes"
    id: "Standardization of Quadratic Equations—Techniques for Solving Equations"
  - collection: "notes"
    id: "sorting-algorithms"
  - collection: "notes"
    id: "easyforgetpoints"
  - collection: "notes"
    id: "orthogonal-list"
  - collection: "notes"
    id: "408tips"
  - collection: "notes"
    id: "Summary-of-Physics-Formulas"
---

## 高数做题方法总结⭐

1. 要熟练运用奇偶性、对称性来化简式子或者排除错误选项。
2. 对于选择题，要学会使用举例子或者带特殊值来辅助解题。
3. 发现一个技巧，大题中即使上一小问证明错误了，但是下一小问使用上一小题的结论依旧可以证明正确，总结：上一小问错误，不影响下一小问使用上一小问的结论进行证明。


## 不定积分坑点

每次求完**不定积分**，不要忘记给原函数加一个**常数项**$C$。

若函数是**分段函数**，记得要考虑**连续性**，从而去确定**常数项**$C$的取值。

## 反常积分判定敛散性

1. 式子能化简先化简
2. 再使用定义法或者判定法去判断

## 曲率的理解⭐

### 1. 直角坐标 $y = y(x)$
$$
K=\frac{|y''|}{\big(1+(y')^2\big)^{\frac{3}{2}}}
$$

### 2. 参数方程 $\begin{cases}x=\varphi(t)\\y=\psi(t)\end{cases}$
$$
K=\frac{|\varphi'(t)\psi''(t)-\varphi''(t)\psi'(t)|}{\Big[\big(\varphi'(t)\big)^2+\big(\psi'(t)\big)^2\Big]^{\frac{3}{2}}}
$$

### 3. 极坐标 $\rho=\rho(\theta)$
$$
K=\frac{|\rho^2+2(\rho')^2-\rho\rho''|}{\big(\rho^2+(\rho')^2\big)^{\frac{3}{2}}}
$$

### 曲率半径
$$
R=\frac1K
$$

### 曲率的几何含义

曲线的曲率表示曲线在某一切点处弯曲程度的数值。曲线的曲率越大，弯曲程度越大。

例如下方是$y=-0.5x^{2}+1$和$y=-2x^{2}+1$的图像.

* $y=-0.5x^{2}+1$的曲率是$\kappa = \frac{|y''|}{(1 + y'^2)^{3/2}} = \frac{1}{(1 + x^2)^{3/2}}$

* $y=-2x^{2}+1$的曲率是$\kappa = \frac{|y''|}{(1 + y'^2)^{3/2}} = \frac{4}{(1 + 16x^2)^{3/2}}$

![曲率几何含义的体现](./assets/image1.png)

## 微分方程解的性质

$$y' + P(x)y = 0 （*）$$

$$y' + P(x)y = Q(x)（**）$$

* 若有$y_1$和$y_2$是方程`*`的解，则$y_1$与$y_2$的线性组合也是`*`的解；

* 若有$y_1$和$y_2$是方程`**`的解，则$y_1-y_2$是`*`的解；

* 若有$y_1$和$y_2$是方程`**`的解，则$k_1y_1+k_2y_2$，当$k_1+k_2=0$时是`*`的解，当$k_1+k_2=1$时是`**`的解。

## 数学归纳法

1. 举实际例子看规律；
2. 假设规律为“巴拉巴拉”；
3. 代入验证假设，是否正确；
4. 最后归纳结论。

## 何为变化率

假设此时说点$P$的横坐标对时间的变化率为$v_0$，其实就是x关于t的导数，因此导数即变化率。

> 例子，2016年真题卷，填空题13题

## 注意定义域范围

所有定义域都要考虑，并且若有绝对值存在，还要情况讨论。

## 多元函数求极值

1. 对每个未知量进行求偏导；
2. 让每个偏导的隐函数为0，联立方程组求解；
3. 将解出来的值，即是(x,y)类似的元组，它们就是极值点；
4. 解出来的值都是驻点，不是极值点；
5. 分别令$A=\frac{\partial^2 F}{\partial x^2}；B=\frac{\partial^2 F}{\partial x \partial y}；C=\frac{\partial^2 F}{\partial y^2}$
6. 将求出的驻点分别代入A、B、C中，确定其值
   - 当$AC-B^2 > 0$时，说明当前的驻点是极值；
   - 当$AC-B^2 = 0$时，说明当前的驻点是鞍点；
   - 当$AC-B^2 < 0$时，说明当前的驻点需要特殊判断；
7. $A>0$，说明它是极小值；$A<0$，说明它是极大值；
8. 需要将驻点一一代入原方程，确定最终的最值。

## 常见的几何函数

[link](/personal-website/notes/geometric-functions/)

## 一重积分与二重积分之间的转化

### 二重积分 → 累次积分
1. 直角坐标：选积分次序（X 型 / Y 型）
2. 极坐标：含 $x^2+y^2$ 或圆域时用，记得乘雅可比 $r$
3. 对称性 + 奇偶性简化计算

### 一重积分 → 二重积分（升维技巧）
1. 乘积升维：$\int_a^b f(x)\,dx \cdot \int_a^b g(x)\,dx = \iint_D f(x)g(y)\,dxdy$
2. 变量字母无关：$\int_a^b f(x)\,dx = \int_a^b f(y)\,dy$，配合轮换对称性
3. 不等式证明：平方/乘积凑成二重积分（如柯西-施瓦茨）

### 累次积分 → 一重积分
1. 交换积分次序
2. 变限积分升维后换序：$\int_a^b dx\int_a^x f(t)\,dt = \int_a^b f(t)(b-t)\,dt$

### 辅助工具
1. 轮换对称性：区域关于 $y=x$ 对称
2. 形心公式：$\iint_D x\,d\sigma = \bar{x}\cdot S_D$

## 矩阵相似与特征值的关系

相似可以得$P^{-1}AP=B$，即矩阵A的初等变换可以得到B，而初等变换不会影响矩阵A的秩，从而可以得到$r(A)=r(B)$。

## 判断两矩阵是否相似的

* 特征值是否相同
* 特征方程是否相同，特征方程的秩是否相同
* $|A|$和$|B|$是否相同
* $tr(A)$和$tr(B)$是否相同
* $f(A)$和$f(B)$是否相似

> 以上条件只有有一个不满足，两个矩阵就不是相似矩阵

## 矩阵秩的性质一定要好好背，这个考点太多了

我此时能记得的有：

* $r(A)=r(A^T)=r(A^{-1})=r(P^{-1}AP)$
* $A_{m,n}$和$B_{n, s}$，有$r(A)+r(B)-n\leq r(AB) \leq min(r(A), r(B))$
* $r(A)\pm r(B) \leq r(A)+r(B)$
* $AB=O$，则$r(A)+r(B) \leq n$
* $r(A,B) \geq max(r(A), r(B))$
* $r\binom{A}{B} \geq max(r(A), r(B))$
* 设$A_{m,n}$，$B_{m,n}$，若有$r(A)=n$，则$r(AB)=r(B)$;同理可得，若有$r(B)=n$，则$r(AB)=r(A)$;
* 设$A$为$n$阶非零矩阵，则$r(A)=1$的充分必要条件是存在非零列向量$\alpha, \beta$，使得$A=\alpha \beta^{T}$

## 求导时的注意点⚠️

注意求导的函数是不是复合函数，如果是一定要用链式法则求干净，这里容易发生计算错误

> 自己掉坑的题，2018年真题，解答题，题15

## 求微分方程的注意点⚠️

当微分方程中出现**不定积分表示原函数时**，当心自己解出来的答案是**不定积分原函数**，还是**不定积分原函数的导数**

> 自己掉坑的题，2018年真题，解答题，题16

## 二重积分·积分限的误解

> 错误来自真题2018年，解答题，题17

我轻廖把参数方程求得的极值当作二重积分的积分限，这是错的，两个方程的极值只能确定这个积分区域的投影范围，真实的区域可能是在这个矩形区域内的一个不规则图像。

![投影区域与真实区域的区别](./assets/image2.png)

> **核心一句话**
> 
>极值 / 最值，求的是区域在坐标轴上的【投影区间】，只适合做外层积分限；不能直接拿来当内层积>分限！

## 分段函数求导的坑点

特别是分段函数的分界点，因为此处求导左导与右导的**区间不一样**，**函数也不一样**，从而就需要分开来求导，最后用导数的定义**左导右导都有值且相同**此时导数才存在。

> 错题，2019年真题，解答题19题

## 微分方程解的概念，遗忘了

齐次微分方程与非齐次微分方程的解的形式，需要回顾，可以翻书或者问AI。

## 放缩法比较大小的相关题

> 题目列表
>
> 2019年真题，题5

## 两条直线在一点相切的含义（特殊知识点）

直线$y=f(x)$与直线$y=g(x)$在x=a点处相切，说明$f(a)=g(a),f'(a)=g'(a)$，但是不能说明$f''(a)=g''(a)$。

> 错题，2019年真题，题6

## 正交矩阵在题目中的含义

1. 正交矩阵**一定**可以**相似对角化**。
2. 正交矩阵的不同的特征值对应的特征向量，两两之间**一定**正交。
3. 正交矩阵**一定**可以**正交相似对角化**

## 定积分换元法与凑微分的区别⚠️

举便说明：

$$
✅\int_{0}^{2} x^{2} \cdot 2x \, dx
= \int_{0}^{2} x^{2} \, d\!\left(x^{2}\right)
= \left. \frac{x^{4}}{2} \right|_{0}^{2}
= 8
$$

$$
❌\int_{0}^{2} (t+1)^{2} \, dt
= \int_{0}^{2} (t+1)^{2} \, d\!\left(t+1\right)
= \left. \frac{(t+1)^{3}}{3} \right|_{0}^{2}
= \frac{26}{3}
$$

$$
✅\int_{0}^{2} (t+1)^{2} \, dt
= \int_{0}^{3} (t+1)^{2} \, d\!\left(t+1\right)
= \left. \frac{(t+1)^{3}}{3} \right|_{0}^{2}
= \frac{26}{3}
$$

第一个式子对，因为它进行的微分等价变换$\int_{x=a}^{x=b} f(\varphi(x))d\varphi(x)$。

第二个式子错，因为在进行积分计算时，$d\!\left(t+1\right)$属于**变量替换**了，原式子中是没有与$(t+1)$可以等价的微分式子，此处是换元操作，就需要进行上下限的改动。如果不改动上下限区间，就会导致结果错误，因为原式是对t这个变量进行求积分，后式是对t+1这个变量进行积分，**积分变量变了，上下限也要跟着变**。**重点**⚠️，第一个式子$d$后面的东西变了，但本质上，上下限式子的变量没有变，我只是把原来求**积分的变量x**变成了关于**x的表达式$\varphi(x)$**

**最简区分两条路线**

路线 A（凑微分、不设 u，你想用的这个路线）

1. $\int_{x=a}^{x=b} f(\varphi(x))d\varphi(x)$
2. 用整体法写出原函数：$\Phi(\varphi(x))$
3. 计算 $\boldsymbol{\Phi(\varphi(b))-\Phi(\varphi(a))}$ ✔

路线 B（正式换元、设 $u=\varphi(x)$）

1. 令 $u=\varphi(x)$
2. 算出 $u_1=\varphi(a),u_2=\varphi(b)$
3. $\int_{u=u_1}^{u=u_2} f(u)du$ ✔

## 向量组等价的充要条件

① 定义法：相互线性表示
$$
\boxed{\mathrm I\cong\mathrm {II}\iff
\begin{cases}
\mathrm I\text{可由}\mathrm {II}\text{线性表示}\\
\mathrm {II}\text{可由}\mathrm I\text{线性表示}
\end{cases}}
$$

② 秩的判定法（考研最常用）
记：
$$
A=(\alpha_1,\ldots,\alpha_m),\quad
B=(\beta_1,\ldots,\beta_n)
$$

则：
$$
\boxed{\mathrm I\cong\mathrm {II}\iff
r(A)=r(B)=r(A,B)}
$$

其中 $r(A,B)$ 表示将两个向量组的所有向量合并后组成矩阵的秩。

## 行列式计算方法

在矩阵求逆时，只能做行变换/列变换。

但在行列式计算时，行变换与列变换可以混用，没有这个限制。

## 记得求导公式、积分公式、麦克劳林公式、伽马公式都要背熟啊⭐⭐⭐

## 合同变换相关性质与结论

> 合同的具体定义翻书或者问AI

⚠️ 注意区分：

- 合同变换：$B=P^TAP$，**P 可逆即可**，目标处理二次型；
- 相似变换：$B=P^{-1}AP$，目标求特征值、对角化；
- 正交变换：P正交，$P^T=P^{-1}$，此时**既是相似又是合同**。

**✅ 可推出的性质**

1. $A^T=A \implies B^T=B$，**实对称矩阵合同得到的矩阵仍然实对称**
2. A 可逆 $\iff B$ 可逆（秩相同）
3. A 正定 $\iff B$ 正定（正惯性指数 = 阶数）
4. A 负定 $\iff B$ 负定；半正定 / 半负定也保持不变
5. 行列式：$|B|=|P^TAP|=|P|^2|A|$
   - $|P|^2>0$，所以：$\boldsymbol{|A|}$ 和 $\boldsymbol{|B|}$ **同号**
   - ⚠️ 但**行列式不一定相等！** 这点和相似不一样，相似矩阵行列式相等，合同不要求。
6. 特征值：**合同不保持特征值相同**！
> 
> 合同 ≠ 相似，除非 P 正交。两个矩阵合同，特征值可以完全不一样，**只有惯性指数不变**。

**✅ 传递、自反、对称（合同是等价关系）**

- 自反：$A\simeq A$（取$P=E$）
- 对称：$A\simeq B \implies B\simeq A$（$B=(P^{-1})^T A P^{-1}$）
- 传递：$A\simeq B,\;B\simeq C \implies A\simeq C$

## 定积分的定义的考题

定积分的定义含有一定的放缩思想，因为它本质上是对一个[0,1]的区间进行n次划分，取$\frac{1}{n}$大小的区间的一个点，看作是尽似点进行求值，也就是区间内的点$ x$，$左边界 \le x \le 右边界$。

![定积分定义的几何划分](./assets/image3.png)

> 2021年真题，题7

## 二次题题目的坑点

当你在用配方法来进行标准化二次型时，一定要验证一下配方后的矩阵P是不是可逆阵

> 错题，2021年真题，题8

## 三阶齐次方程的解（易忘记点）

[link](/personal-website/notes/steps-for-solving-third-order-linear-differential-equations-with-constant-coefficients/)

## 等价无穷小加深理解的好题

当$x \to 0$ 时，$\alpha(x),\beta(x)$ 是非零无穷小量，给出以下四个命题，其中所有正确的序号是（）

①若$\alpha(x)\sim\beta(x)$，则$\alpha^{2}(x)\sim\beta^{2}(x)$

②若$\alpha^{2}(x)\sim\beta^{2}(x)$，则$\alpha(x)\sim\beta(x)$

③若$\alpha(x)\sim\beta(x)$，则$\alpha(x)-\beta(x)=o(\alpha(x))$

④若$\alpha(x)-\beta(x)=o(\alpha(x))$，则$\alpha(x)\sim\beta(x)$

(A)①② (B)①④ (C)①③④ (D)②③④

✅ 答案：**C**

---

**简要解析**

- ①：$\lim \dfrac{\alpha^2}{\beta^2}=\left(\lim\dfrac{\alpha}{\beta}\right)^2=1^2=1$，正确。
- ②：反例$\alpha=x,\beta=-x$，$\alpha^2\sim\beta^2$，但$\dfrac{\alpha}{\beta}\to -1$，不等价，错误。
- ③：$\lim\dfrac{\alpha-\beta}{\alpha}=\lim\left(1-\dfrac{\beta}{\alpha}\right)=0$，即$\alpha-\beta=o(\alpha)$，正确。
- ④：$\lim\dfrac{\alpha-\beta}{\alpha}=0 \Rightarrow 1-\lim\dfrac{\beta}{\alpha}=0 \Rightarrow \lim\dfrac{\beta}{\alpha}=1$，等价，正确。

> 真题位置，2022年数二真题，选择题，题1

## 导数定义与保号性理解的好题

> 设函数 $f(x)$ 在 $x=x_0$ 处有二阶导数，则（）
> 
> (A) 当 $f'(x_0)>0$ 时，$f(x)$ 在 $x_0$ 的某邻域内单调增加
> 
> (B) 当 $f'(x_0)>0$ 时，$f(x)$ 在 $x_0$ 的某邻域内单调增加
> 
> (C) 当 $f''(x_0)>0$ 时，$f(x)$ 在 $x_0$ 的某邻域内是凹函数
> 
> (D) 当 $f''(x_0)>0$ 时，$f(x)$ 在 $x_0$ 的某邻域内是凹函数

✅ **答案：B**（原题 A、B 文字就是这个设置，核心考点：**导数定义 + 保号性**）

**解析**

已知 $f(x)$ 在 $x_0$ 二阶可导，只能保证：
$f'(x)$ 在 $x_0$ **存在**，**不能保证 $f'(x)$ 在 $x_0$ 连续**。
$f'(x_0)=\lim_{x\to x_0}\frac{f(x)-f(x_0)}{x-x_0}>0$
由**极限的保号性**：存在 $\delta>0$，当 $0<|x-x_0|<\delta$ 时，
$\frac{f(x)-f(x_0)}{x-x_0}>0$

- $x\in(x_0,x_0+\delta)\Rightarrow f(x)>f(x_0)$
- $x\in(x_0-\delta,x_0)\Rightarrow f(x)<f(x_0)$
也就是：在这个邻域内，$f(x)$ 在 $x_0$ 附近单调递增。

❌ 易错坑（C、D 错因）：
$f''(x_0)>0$ 只是单点二阶导大于 0，**不能推出二阶导在邻域内恒正**，无法判定邻域凹凸；
如果条件改成「在 $x_0$ 邻域二阶可导且 $f''(x_0)>0$」，才可以由保号性判断凹凸。

> 
> 一句话结论：**一阶导单点存在且 > 0 ⇒ 局部单调增；二阶导单点 > 0，推不出局部凹**

> 真题位置，2022年真题，选择题，题3

## 极限存在性理解的好题推荐

> 已知数列 $\{x_n\}$，其中 $\boldsymbol{-\dfrac{\pi}{2}\le x_n \le \dfrac{\pi}{2}}$，则（）

- (A) 当 $\lim\limits_{n\to\infty}\cos(\sin x_n)$ 存在时，$\lim\limits_{n\to\infty}x_n$ 存在
- (B) 当 $\lim\limits_{n\to\infty}\sin(\cos x_n)$ 存在时，$\lim\limits_{n\to\infty}x_n$ 存在
- (C) 当 $\lim\limits_{n\to\infty}\cos(\sin x_n)$ 存在时，$\lim\limits_{n\to\infty}\sin x_n$ 存在，$\lim\limits_{n\to\infty}x_n$ 不一定存在
- (D) 当 $\lim\limits_{n\to\infty}\sin(\cos x_n)$ 存在时，$\lim\limits_{n\to\infty}\cos x_n$ 存在，$\lim\limits_{n\to\infty}x_n$ 不一定存在

✅ **答案：D**

---

**简要解析**

1. 先看 $\boldsymbol{\sin(\cos x_n)}$：
$y=\sin t$ 在 $t\in[-1,1]$ 上**严格单调**，
若 $\sin(\cos x_n)$ 极限存在 $\implies \cos x_n$ 极限一定存在；
但 $\cos x$ 是偶函数：$\cos a=\cos(-a)$。
可以构造子列：$x_{2k}=a,\ x_{2k+1}=-a\ (a\neq0)$，
此时 $\cos x_n$ 收敛，但 $x_n$ 在 $a,-a$ 来回跳，$x_n$ 极限不存在 → D 正确，B 错误。
1. 再看 $\boldsymbol{\cos(\sin x_n)}$：
$y=\cos t$ 在 $t\in[-1,1]$ 是偶函数，**不是严格单调**。
取 $\sin x_n$ 交替取 $t_0,-t_0$，$\cos(\sin x_n)$ 不变，但是 $\sin x_n$ 都不一定收敛，C 错；
进一步可以构造让 $x_n$ 震荡，A 错。

## 极坐标面积公式

1. **基础公式（曲线 $r=r(\theta)$，$\alpha\le\theta\le\beta$）**

$\boldsymbol{S=\frac12\int_{\alpha}^{\beta} r^2(\theta)\,d\theta}$

> 
> 原理：极坐标下微元是扇形微元，$\displaystyle dS=\frac12 r^2 d\theta$，不是 $\frac12 r dr d\theta$（后者是二重积分微元）

2. **两条极坐标曲线之间的面积（外曲线 $r_2(\theta)$，内曲线 $r_1(\theta)$）**

$\boldsymbol{S=\frac12\int_{\alpha}^{\beta}\big[r_2^2(\theta)-r_1^2(\theta)\big]d\theta}$

3. **常用经典图形（直接背）**

- 圆：$r=R$，一圈 $\theta\in[0,2\pi]$
$S=\frac12\int_{0}^{2\pi}R^2 d\theta=\pi R^2$
- 心形线：$r=a(1+\cos\theta)$
$S=\frac12\int_{0}^{2\pi}a^2(1+\cos\theta)^2 d\theta=\boldsymbol{\frac32\pi a^2}$
- 双纽线：$r^2=a^2\cos2\theta$

> 
> 左右两叶，$\theta\in[-\tfrac{\pi}{4},\tfrac{\pi}{4}],[\tfrac{3\pi}{4},\tfrac{5\pi}{4}]$
> $S=4\cdot \frac12\int_{0}^{\pi/4} a^2\cos2\theta\,d\theta=\boldsymbol{a^2}$

- 三叶玫瑰线：$r=a\cos3\theta$
$S=\frac12\int_{-\pi/6}^{\pi/6}a^2\cos^23\theta d\theta \cdot 3=\boldsymbol{\frac14\pi a^2}$

## 极坐标定界法

[link](/personal-website/notes/core-guide-to-the-polar-coordinate-delimitation-method/)

## 结尾

未完，待续。。。