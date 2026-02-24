<!--
	Merging two XML files
	Version 1.6
	LGPL (c) Oliver Becker, 2002-07-05
	obecker@informatik.hu-berlin.de
   
	Modified by Pawin Chawanasunthornpot 04/2008
	-Changes to use microsoft xsl syntax for intellisense support
	-Allow attributes merge
	-Add delete mode
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>

	<!-- Normalize the contents of text, comment, and processing-instruction
     nodes before comparing?
     Default: yes -->
	<xsl:param name="normalize" select="'yes'" />

	<!-- Don't merge elements with this (qualified) name -->
	<xsl:param name="dontmerge" />

	<!-- Match only node name or also including attributes -->
	<xsl:param name="attributeMerge" select="false()" />

	<!-- If set to true, text nodes in file1 will be replaced -->
	<xsl:param name="replace" select="true()" />

	<!-- Merge or delete mode -->
	<xsl:param name="mode" />

	<!-- 
	The transformation sheet merges the source document with the
     document provided by the parameter "with".
	 -->
	<xsl:param name="with" />

	<xsl:template match="*">
		<xsl:message>
			<xsl:text />Merging input with '<xsl:value-of select="$with" />
			<xsl:text>'</xsl:text>
		</xsl:message>
		<xsl:if test="string($with)=''">
			<xsl:message terminate="yes">
				<xsl:text>No input file specified (parameter 'with')</xsl:text>
			</xsl:message>
		</xsl:if>

		<xsl:choose>
			<xsl:when test="$mode='merge'">
				<xsl:call-template name="merge">
					<xsl:with-param name="nodes1" select="/node()" />
					<xsl:with-param name="nodes2" select="$with" />
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$mode='delete'">
				<xsl:call-template name="delete">
					<xsl:with-param name="nodes1" select="$with" />
					<xsl:with-param name="nodes2" select="/node()" />
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:message terminate="yes">
					<xsl:text>Invalid value for mode variable(valid values: merge and delete)</xsl:text>
				</xsl:message>
			</xsl:otherwise>
		</xsl:choose>

	</xsl:template>

	<!-- ============================================================== -->

	<!-- Find the last node for each branch from deleting document, then use it to remove from original document -->
	<xsl:template name="delete">
		<xsl:param name="nodes1" />
		<xsl:param name="nodes2" />

		<!-- Split $nodes1 and $nodes2 -->
		<xsl:variable name="first1" select="$nodes1[1]" />
		<xsl:variable name="child1" select="$nodes1[1]/node()" />
		<xsl:variable name="siblings1" select="$nodes1[position()>1]" />
		<xsl:variable name="first2" select="$nodes2[1]" />
		<xsl:variable name="child2" select="$nodes2[1]/node()" />
		<xsl:variable name="siblings2" select="$nodes2[position()>1]" />
		<xsl:variable name="rest2" select="$nodes2[position()!=1]" />
		<!-- Determine type of node $first1, $first2 and child node of first1 -->
		<xsl:variable name="type1">
			<xsl:apply-templates mode="detect-type" select="$first1" />
		</xsl:variable>
		<xsl:variable name="type2">
			<xsl:apply-templates mode="detect-type" select="$first2" />
		</xsl:variable>
		<xsl:variable name="childtype1">
			<xsl:apply-templates mode="detect-type" select="$nodes1[1]/node()" />
		</xsl:variable>

		<xsl:choose>
			<xsl:when test="$type2!='element' and count($siblings2)&gt;0">
				<xsl:copy-of select="$first2"/>
				<!-- Get the next sibling if it exists -->
				<xsl:if test="count($siblings2)&gt;0">
					<xsl:call-template name="delete">
						<xsl:with-param name="nodes1" select="$first1" />
						<xsl:with-param name="nodes2" select="$siblings2" />
					</xsl:call-template>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:if test="$type2='text'">
					<xsl:copy-of select="$first2"/>
				</xsl:if>
				
				<!-- Compare $first1 and $first2 -->
				<xsl:variable name="diff-first">
					<xsl:call-template name="compare-nodes">
						<xsl:with-param name="node1" select="$first1" />
						<xsl:with-param name="node2" select="$first2" />
					</xsl:call-template>
				</xsl:variable>
				
				<xsl:choose>
					<!-- $first1 doesn't have the same node name as $first2 -->
					<xsl:when test="$diff-first='!'">
						<!-- Compare $first1 and $siblings2 -->
						<xsl:variable name="diff-rest">
							<xsl:for-each select="$rest2">
								<xsl:call-template name="compare-nodes">
									<xsl:with-param name="node1" select="$first1" />
									<xsl:with-param name="node2" select="." />
								</xsl:call-template>
							</xsl:for-each>
						</xsl:variable>

						<xsl:choose>
							<!-- $first1 is in $siblings2 -->
							<xsl:when test="contains($diff-rest,'=')">
								<!-- determine position of $first1 in $siblings2 and copy all preceding nodes of $rest2, but don't copy the matching node -->
								<xsl:variable name="pos" select="string-length(substring-before( $diff-rest,'=')) + 2" />
								<xsl:variable name="matchednode" select="$nodes2[position() = $pos]"/>
								<xsl:copy-of select="$nodes2[position() &lt; $pos]" />
								<xsl:if test="count($matchednode/node())&gt;0 and count($first1/node())&gt;0 and $childtype1 != 'text'">
									<xsl:element name="{name($matchednode)}" namespace="{namespace-uri($matchednode)}">
										<xsl:copy-of select="$matchednode/namespace::*" />
										<xsl:copy-of select="$matchednode/@*" />
										<xsl:call-template name="delete">
											<xsl:with-param name="nodes1" select="$child1" />
											<xsl:with-param name="nodes2" select="$matchednode/node()" />
										</xsl:call-template>
									</xsl:element>
								</xsl:if>
								<xsl:call-template name="delete">
									<xsl:with-param name="nodes1" select="$siblings1" />
									<xsl:with-param name="nodes2" select="$nodes2[position() &gt; $pos]" />
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<!-- Get the next sibling if it exists -->
								<xsl:if test="count($siblings2)&gt;0">
									<xsl:copy-of select="$first2"/>
									<xsl:call-template name="delete">
										<xsl:with-param name="nodes1" select="$first1" />
										<xsl:with-param name="nodes2" select="$siblings2" />
									</xsl:call-template>
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>

					</xsl:when>
					<xsl:otherwise>
						<!-- Find the last node that matches from both documents -->
						<xsl:choose>
							<xsl:when test="count($child1)&gt;0">
								<xsl:choose>
									<xsl:when test="$childtype1='text'">
									</xsl:when>
									<xsl:otherwise>
										<xsl:element name="{name($first2)}" namespace="{namespace-uri($first2)}">
											<xsl:copy-of select="$first2/namespace::*" />
											<xsl:copy-of select="$first2/@*" />
											<xsl:call-template name="delete">
												<xsl:with-param name="nodes1" select="$child1" />
												<xsl:with-param name="nodes2" select="$child2" />
											</xsl:call-template>
										</xsl:element>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:call-template name="delete">
									<xsl:with-param name="nodes1" select="$siblings1" />
									<xsl:with-param name="nodes2" select="$siblings2" />
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<!-- Get the next sibling if it exists -->
								<xsl:if test="count($siblings2)&gt;0">
									<xsl:call-template name="delete">
										<xsl:with-param name="nodes1" select="$siblings1" />
										<xsl:with-param name="nodes2" select="$siblings2" />
									</xsl:call-template>
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>

			</xsl:otherwise>
		</xsl:choose>

	</xsl:template>

	<!-- The "merge" template -->
	<xsl:template name="merge">
		<xsl:param name="nodes1" />
		<xsl:param name="nodes2" />

		<xsl:choose>
			<!-- Is $nodes1 resp. $nodes2 empty? -->
			<xsl:when test="count($nodes1)=0">
				<xsl:copy-of select="$nodes2" />
			</xsl:when>
			<xsl:when test="count($nodes2)=0">
				<xsl:copy-of select="$nodes1" />
			</xsl:when>

			<xsl:otherwise>
				<!-- Split $nodes1 and $nodes2 -->
				<xsl:variable name="first1" select="$nodes1[1]" />
				<xsl:variable name="rest1" select="$nodes1[position()!=1]" />
				<xsl:variable name="first2" select="$nodes2[1]" />
				<xsl:variable name="rest2" select="$nodes2[position()!=1]" />
				<!-- Determine type of node $first1 -->
				<xsl:variable name="type1">
					<xsl:apply-templates mode="detect-type" select="$first1" />
				</xsl:variable>

				<!-- Compare $first1 and $first2 -->
				<xsl:variable name="diff-first">
					<xsl:call-template name="compare-nodes">
						<xsl:with-param name="node1" select="$first1" />
						<xsl:with-param name="node2" select="$first2" />
					</xsl:call-template>
				</xsl:variable>

				<xsl:choose>
					<!-- $first1 doesn't have the same node name as $first2 -->
					<xsl:when test="$diff-first='!'">
						<!-- Compare $first1 and $rest2 -->
						<xsl:variable name="diff-rest">
							<xsl:for-each select="$rest2">
								<xsl:call-template name="compare-nodes">
									<xsl:with-param name="node1" select="$first1" />
									<xsl:with-param name="node2" select="." />
								</xsl:call-template>
							</xsl:for-each>
						</xsl:variable>

						<xsl:choose>
							<!-- $first1 is in $rest2 and 
								$first1 is *not* an empty text node  -->
							<xsl:when test="contains($diff-rest,'=') and not($type1='text' and normalize-space($first1)='')">
								<!-- determine position of $first1 in $nodes2
                          and copy all preceding nodes of $nodes2 -->
								<xsl:variable name="pos" select="string-length(substring-before( $diff-rest,'=')) + 2" />
								<xsl:copy-of select="$nodes2[position() &lt; $pos]" />

								<!-- merge $first1 with its equivalent node -->
								<xsl:choose>
									<!-- Elements: merge -->
									<xsl:when test="$type1='element'">
										<xsl:element name="{name($first1)}" namespace="{namespace-uri($first1)}">
											<xsl:copy-of select="$first1/namespace::*" />
											<xsl:copy-of select="$first2/namespace::*" />
											<xsl:copy-of select="$first1/@*" />
											<xsl:call-template name="merge">
												<xsl:with-param name="nodes1" select="$first1/node()" />
												<xsl:with-param name="nodes2" select="$nodes2[position()=$pos]/node()" />
											</xsl:call-template>
										</xsl:element>
									</xsl:when>
									<!-- Other: copy -->
									<xsl:otherwise>
										<xsl:copy-of select="$first1" />
									</xsl:otherwise>
								</xsl:choose>

								<!-- Merge $rest1 and rest of $nodes2 -->
								<xsl:call-template name="merge">
									<xsl:with-param name="nodes1" select="$rest1" />
									<xsl:with-param name="nodes2" select="$nodes2[position() &gt; $pos]" />
								</xsl:call-template>
							</xsl:when>

							<xsl:when test="contains($diff-rest,'_') and not($type1='text' and normalize-space($first1)='')">
								<!-- determine position of $first1 in $nodes2 and copy all preceding nodes of $nodes2 -->
								<xsl:variable name="pos" select="string-length(substring-before( $diff-rest,'_'))" />
								<xsl:copy-of select="$nodes2[position() &lt; $pos]" />
								<!-- merge $first1 with its equivalent node -->
								<xsl:choose>
									<!-- Elements: merge -->
									<xsl:when test="$type1='element'">
										<xsl:element name="{name($first1)}" namespace="{namespace-uri($first1)}">
											<xsl:copy-of select="$first1/namespace::*" />
											<xsl:copy-of select="$first2/namespace::*" />
											<xsl:copy-of select="$first1/@*" />
											<xsl:copy-of select="$first2/@*" />
											<xsl:call-template name="merge">
												<xsl:with-param name="nodes1" select="$first1/node()" />
												<xsl:with-param name="nodes2" select="$nodes2[position()=$pos]/node()" />
											</xsl:call-template>
										</xsl:element>
									</xsl:when>
									<!-- Other: copy -->
									<xsl:otherwise>
										<xsl:copy-of select="$first1" />
									</xsl:otherwise>
								</xsl:choose>

								<!-- Merge $rest1 and rest of $nodes2 -->
								<xsl:call-template name="merge">
									<xsl:with-param name="nodes1" select="$rest1" />
									<xsl:with-param name="nodes2" select="$nodes2[position() &gt; $pos]" />
								</xsl:call-template>
							</xsl:when>

							<!-- $first1 is a text node and replace mode was activated -->
							<xsl:when test="$type1='text' and $replace">
								<xsl:call-template name="merge">
									<xsl:with-param name="nodes1" select="$rest1" />
									<xsl:with-param name="nodes2" select="$nodes2" />
								</xsl:call-template>
							</xsl:when>

							<!-- else: $first1 is not in $rest2 or $first1 is an empty text node -->
							<xsl:otherwise>
								<xsl:copy-of select="$first1" />
								<xsl:call-template name="merge">
									<xsl:with-param name="nodes1" select="$rest1" />
									<xsl:with-param name="nodes2" select="$nodes2" />
								</xsl:call-template>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:when>

					<!-- $first1 has the same node name as $first2 but different attributes -->
					<xsl:when test="contains($diff-first,'_')">
						<!-- Merge $first1 and $first2 -->
						<xsl:element name="{name($first1)}" namespace="{namespace-uri($first1)}">
							<xsl:copy-of select="$first1/namespace::*" />
							<xsl:copy-of select="$first2/namespace::*" />
							<xsl:copy-of select="$first1/@*" />
							<xsl:copy-of select="$first2/@*" />
							<xsl:call-template name="merge">
								<xsl:with-param name="nodes1" select="$first1/node()" />
								<xsl:with-param name="nodes2" select="$first2/node()" />
							</xsl:call-template>
						</xsl:element>

						<!-- Merge $rest1 and rest of $nodes2 -->
						<xsl:call-template name="merge">
							<xsl:with-param name="nodes1" select="$rest1" />
							<xsl:with-param name="nodes2" select="$nodes2[position() > 1]" />
						</xsl:call-template>
					</xsl:when>

					<!-- else: $first1 = $first2 -->
					<xsl:otherwise>
						<xsl:choose>
							<!-- Elements: merge -->
							<xsl:when test="$type1='element'">
								<xsl:element name="{name($first1)}" namespace="{namespace-uri($first1)}">
									<xsl:copy-of select="$first1/namespace::*" />
									<xsl:copy-of select="$first2/namespace::*" />
									<xsl:copy-of select="$first1/@*" />
									<xsl:call-template name="merge">
										<xsl:with-param name="nodes1" select="$first1/node()" />
										<xsl:with-param name="nodes2" select="$first2/node()" />
									</xsl:call-template>
								</xsl:element>
							</xsl:when>
							<!-- Other: copy -->
							<xsl:otherwise>
								<xsl:copy-of select="$first1" />
							</xsl:otherwise>
						</xsl:choose>
						<!-- Merge $rest1 and $rest2 -->
						<xsl:call-template name="merge">
							<xsl:with-param name="nodes1" select="$rest1" />
							<xsl:with-param name="nodes2" select="$rest2" />
						</xsl:call-template>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>


	<!-- Comparing single nodes: 
     if $node1 and $node2 are equivalent then the template creates a 
     text node "="
	 if $node1 and $node2 are equivalent but attributes are not, then the template creates a 
	 text node "!!"
	 otherwise a text node "!" -->
	<xsl:template name="compare-nodes">
		<xsl:param name="node1" />
		<xsl:param name="node2" />
		<xsl:variable name="type1">
			<xsl:apply-templates mode="detect-type" select="$node1" />
		</xsl:variable>
		<xsl:variable name="type2">
			<xsl:apply-templates mode="detect-type" select="$node2" />
		</xsl:variable>

		<xsl:choose>
			<!-- Are $node1 and $node2 element nodes with the same name? -->
			<xsl:when test="$type1='element' and $type2='element' and local-name($node1)=local-name($node2) and namespace-uri($node1)=namespace-uri($node2) and name($node1)!=$dontmerge and name($node2)!=$dontmerge">
				<!-- Comparing the attributes -->
				<xsl:variable name="diff-att">
					<!-- if number of attributes are not the same, return . ... -->
					<xsl:if test="count($node1/@*)!=count($node2/@*)">.</xsl:if>
					<!-- ... ? -->
					<xsl:if test="count($node1/@*)&gt;0 and count($node2/@*)=0">_</xsl:if>
					<xsl:if test="count($node1/@*)=0 and count($node2/@*)&gt;0">_</xsl:if>
					<xsl:if test="count($node1/@*)&gt;0 and count($node2/@*)&gt;0">
						<xsl:for-each select="$node1/@*">
							<xsl:if test="not($node2/@* [local-name()=local-name(current()) and namespace-uri()=namespace-uri(current()) and .=current()])">_</xsl:if>
						</xsl:for-each>
					</xsl:if>
				</xsl:variable>
				<xsl:choose>
					<!-- Otherwise: different name/content -->					
					<xsl:when test="string-length($diff-att)!=0 and not($attributeMerge)">!</xsl:when>
					<xsl:when test="string-length($diff-att)!=0 and $attributeMerge">_</xsl:when>
					<xsl:otherwise>=</xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<!-- Other nodes: test for the same type and content -->
			<xsl:when test="$type1!='element' and $type1=$type2 and name($node1)=name($node2) and ($node1=$node2 or ($normalize='yes' and normalize-space($node1)= normalize-space($node2)))">=</xsl:when>

			<!-- Otherwise: different node types -->
			<xsl:otherwise>!</xsl:otherwise>
		</xsl:choose>
	</xsl:template>


	<!-- Type detection, thanks to M. H. Kay -->
	<xsl:template match="*" mode="detect-type">element</xsl:template>
	<xsl:template match="text()" mode="detect-type">text</xsl:template>
	<xsl:template match="comment()" mode="detect-type">comment</xsl:template>
	<xsl:template match="processing-instruction()" mode="detect-type">pi</xsl:template>

</xsl:stylesheet>